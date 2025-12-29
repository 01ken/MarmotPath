"""
学習パス最適化サービス
量子アニーリング風の最適化（現在はダミー実装）
"""
import json
import pandas as pd
import itertools
import random
import numpy as np

from typing import List, Dict, Set, Tuple
from dataclasses import dataclass
from openjij import SQASampler
from itertools import combinations


@dataclass
class Course:
    id: str
    name: str
    prerequisites: List[str]
    skills_acquired: List[str]
    description: str
    estimated_hours: int
    difficulty: int = 3


@dataclass
class OptimizationResult:
    stages: List[Dict]
    total_courses: int
    estimated_total_hours: int
    optimization_score: float


class LearningPathOptimizer:
    def __init__(self, skills_data: dict, courses_data: dict, careers_data: dict, combinations_data: dict = None):
        self.skills_data = skills_data
        self.courses_data = courses_data
        self.careers_data = careers_data
        self.combinations_data = combinations_data
        self.N_t = 5  # 学習段階の数


    def optimize_learning_path(self, goal: str, num_reads: int = 10) -> Dict:
        """
        学習パス最適化のメイン関数
        現在はダミー実装：ルールベースで段階的な学習パスを生成
        """
        stages = {"stage1": ["course_001", "course_002", "course_003"],
                  "stage2": ["course_004", "course_005"],
                  "stage3": ["course_006", "course_007", "course_008"],
                  "stage4": ["course_009", "course_010"],
                  "stage5": ["course_011", "course_012"]}

        return stages


class QuantumAnnealingOptimizer(LearningPathOptimizer):
    """
    将来的に量子アニーリングを使用した最適化を実装するためのクラス
    現在はダミー実装
    """

    def __init__(self, skills_data: dict, courses_data: dict, careers_data: dict, combinations_data: dict):
        super().__init__(skills_data, courses_data, careers_data, combinations_data)

        self.sampler = SQASampler()
        self.GT_ES_matrix = None
        self.G_ES_arr = None
        self.NS_nonzero_idx = None
        self.QUBO = None
        self.courses_list = list(self.courses_data['courses_master'].keys())

        self._initialization()

    def _initialization(self):
        self.N_skill = len(self.skills_data["skills_master"])
        self.N_course = len(self.courses_data["courses_master"])

        self.GS_matrix = np.zeros((self.N_course, self.N_skill))
        self.NS_matrix = np.zeros((self.N_course, self.N_skill))
        self.B_matrix = np.zeros((self.N_course, self.N_course))


        for val in self.courses_data['courses_master'].values():
            for ps in val['prerequisites']:
                ps_id = self.skills_data['skills_master'][ps]['id']
                self.NS_matrix[val['id'], ps_id] = 1

            for sa in val['skills_acquired']:
                sa_id = self.skills_data['skills_master'][sa]['id']
                self.GS_matrix[val['id'], sa_id] = 1

        for val in self.combinations_data['course_combinations'].values():
            for pair in itertools.combinations(val['courses'], 2):
                pid_0 = self.courses_data['courses_master'][pair[0]]['id']
                pid_1 = self.courses_data['courses_master'][pair[1]]['id']
                self.B_matrix[pid_0, pid_1] = val['synergy_effect']

    def set_career_goal(self, career_id: str):
        selected_career = self.careers_data['career_goals'][career_id]

        ES_list = []
        for rs in selected_career['required_skills']:
            ES_list.append(self.skills_data['skills_master'][rs]['id'])

        self.GT_ES_matrix = np.dot(self.GS_matrix[:, ES_list], self.GS_matrix[:, ES_list].T)
        self.G_ES_arr = np.sum(self.GS_matrix[:, ES_list], axis=1)

        row_indices, col_indices = np.where(self.NS_matrix > 0)
        self.NS_nonzero_idx = list(zip(row_indices, col_indices))

    def create_qubo(self, lambdas: list = [1, 1, 1, 1]):
        lam1 = lambdas[0]
        lam2 = lambdas[1]
        lam3 = lambdas[2]
        lam4 = lambdas[3]

        self.QUBO = {}

        for i in range(self.N_course):
            for j in range(self.N_course):
                for t in range(self.N_t):
                    for t2 in range(self.N_t):
                        val = -1. * lam2 * self.B_matrix[i, j] + lam3 * self.GT_ES_matrix[i, j]
                        val += lam1 - 3. * lam3 * self.G_ES_arr[i] if i == j and t == t2 else 0
                        self.QUBO[(i * self.N_t + t, j * self.N_t + t2)] = val

        for i, s in self.NS_nonzero_idx:
            for t in range(self.N_t)[1:]:
                for j in range(self.N_course):
                    for k in range(self.N_course):
                        for t2 in range(self.N_t)[:t]:
                            for t3 in range(self.N_t)[:t]:
                                self.QUBO[(j * self.N_t + t2, k * self.N_t + t3)] += lam4 * self.GS_matrix[j, s] * self.GS_matrix[k, s]
                    for t2 in range(self.N_t)[:t]:
                        self.QUBO[(i * self.N_t + t, j * self.N_t + t2)] += -2. * lam4 * self.NS_matrix[i, s] * self.GS_matrix[j, s]
                        self.QUBO[(j * self.N_t + t2, j * self.N_t + t2)] += -1. * lam4 * self.GS_matrix[j, s]
                self.QUBO[(i * self.N_t + t, i * self.N_t + t)] += lam4 * self.NS_matrix[i, s] * self.NS_matrix[i, s] + self.NS_matrix[i, s]
            self.QUBO[(i * self.N_t, i * self.N_t)] += 50. * lam4 * self.NS_matrix[i, s] * self.NS_matrix[i, s]

        return self.QUBO

    def optimize_learning_path(self, goal: str, num_reads: int = 10) -> Dict:
        self.set_career_goal(goal)
        print("Setting career goal:", goal)

        self.create_qubo(lambdas=[1.2, 0.1, 1.9, 0.7])
        print("QUBO created with lambdas [1.2, 0.1, 1.9, 0.7]")

        sampleset = self.sampler.sample_qubo(self.QUBO, num_reads=num_reads)
        print("Sampleset obtained from sampler")

        result_arr = sampleset.record[0][0].reshape(self.N_course, self.N_t)

        stages = {}

        for t in range(self.N_t):
            course_idxs = np.where(result_arr[:, t] == 1)[0].tolist()
            stages[f"stage{t + 1}"] = []
            for cidx in course_idxs:
                stages[f"stage{t + 1}"].append(self.courses_list[cidx])

        return stages



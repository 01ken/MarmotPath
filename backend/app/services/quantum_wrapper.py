import sys
from pathlib import Path

# quantumモジュールへのパスを追加
sys.path.append(str(Path(__file__).parent.parent.parent / "quantum"))

from optimization import QuantumAnnealingOptimizer
from app.services.data_loader import data_loader


class QuantumOptimizationService:
    """量子アニーリング最適化のラッパークラス"""

    def __init__(self):
        # データの読み込み
        self.skills_data = data_loader.load_skills()
        self.courses_data = data_loader.load_courses()
        self.careers_data = data_loader.load_careers()
        self.combinations_data = data_loader.load_combinations()

        # 最適化エンジンの初期化
        self.optimizer = QuantumAnnealingOptimizer(
            skills_data=self.skills_data,
            courses_data=self.courses_data,
            careers_data=self.careers_data,
            combinations_data=self.combinations_data
        )

    def optimize_for_career(self, career_name: str, num_reads: int = 10) -> dict:
        """
        職業名から最適な学習パスを取得

        Args:
            career_name: 職業名（例: "Webデザイナー"）
            num_reads: サンプリング回数

        Returns:
            ステージごとの講座リスト
            {
                "stage1": ["course_001", "course_003"],
                "stage2": ["course_004"],
                ...
            }
        """
        return self.optimizer.optimize_learning_path(
            goal=career_name,
            num_reads=num_reads
        )


# グローバルインスタンス
quantum_service = QuantumOptimizationService()
import json
from pathlib import Path
from typing import Dict, Any
from app.core.config import settings


class DataLoader:
    """JSONデータを読み込むシングルトンクラス"""

    def __init__(self):
        self.data_dir = settings.DATA_DIR

        # デバッグ用：初期化時にパスを確認
        print(f"DataLoader initialized with data_dir: {self.data_dir}")
        print(f"Data directory exists: {self.data_dir.exists()}")

        self._careers = None
        self._courses = None
        self._skills = None
        self._combinations = None

    def load_careers(self) -> Dict[str, Any]:
        """職業データの読み込み"""
        if self._careers is None:
            file_path = self.data_dir / "careers.json"
            print(f"Loading careers from: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                self._careers = json.load(f)
        return self._careers

    def load_courses(self) -> Dict[str, Any]:
        """講座データの読み込み"""
        if self._courses is None:
            file_path = self.data_dir / "courses.json"
            print(f"Loading courses from: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                self._courses = json.load(f)
        return self._courses

    def load_skills(self) -> Dict[str, Any]:
        """スキルデータの読み込み"""
        if self._skills is None:
            file_path = self.data_dir / "skills.json"
            print(f"Loading skills from: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                self._skills = json.load(f)
        return self._skills

    def load_combinations(self) -> Dict[str, Any]:
        """組み合わせデータの読み込み"""
        if self._combinations is None:
            file_path = self.data_dir / "combinations.json"
            print(f"Loading combinations from: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                self._combinations = json.load(f)
        return self._combinations


# グローバルインスタンス
data_loader = DataLoader()

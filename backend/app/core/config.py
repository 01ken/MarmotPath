from pydantic_settings import BaseSettings
from pathlib import Path
from typing import List

# プロジェクトのルートディレクトリを取得
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"


class Settings(BaseSettings):
    APP_NAME: str = "MarmotPath"
    DEBUG: bool = True
    DATA_DIR: Path = DATA_DIR  # 絶対パスを使用
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()

# デバッグ用：起動時にパスを確認
if __name__ == "__main__":
    print(f"PROJECT_ROOT: {PROJECT_ROOT}")
    print(f"DATA_DIR: {DATA_DIR}")
    print(f"DATA_DIR exists: {DATA_DIR.exists()}")


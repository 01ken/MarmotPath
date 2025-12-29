import { useState, useEffect } from 'react';
import { careerApi, courseApi, optimizationApi } from './services/api';
import { useProgressStore } from './stores/progressStore';
import { buildSkillTree } from './utils/treeLayout';
import SkillTreeCanvas from './components/skill-tree/SkillTreeCanvas';
import type { Career, Course, OptimizationResult } from './types';
import './App.css';

function App() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { completedCourses } = useProgressStore();

  // 初期データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careersData, coursesData] = await Promise.all([
          careerApi.getCareers(),
          courseApi.getCourses(),
        ]);
        setCareers(careersData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // 最適化の実行
  const handleOptimize = async () => {
    if (!selectedCareer) return;

    setLoading(true);
    try {
      const data = await optimizationApi.optimize(selectedCareer);
      setResult(data);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('最適化に失敗しました😢');
    } finally {
      setLoading(false);
    }
  };

  // スキルツリーの生成（依存関係ベース）
  const skillTree = result && result.recommended_course_ids.length > 0
    ? buildSkillTree(courses, result.recommended_course_ids, completedCourses)
    : null;

  const progressPercentage = result
    ? Math.round((completedCourses.filter(id => result.recommended_course_ids.includes(id)).length / result.total_courses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-7xl mb-2 animate-bounce">🐿️</div>
          </div>
          <h1 className="text-6xl font-bold mb-3">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              MarmotPath
            </span>
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            あなたの学習の道を、マーモットと一緒に歩みましょう✨
          </p>
        </div>

        {/* 職業選択セクション */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-4 border-pink-200">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            目指す職業を選んでね
          </h2>

          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="w-full p-4 border-3 border-purple-300 rounded-2xl mb-6 text-lg font-medium
                     focus:border-pink-400 focus:ring-4 focus:ring-pink-200 focus:outline-none
                     transition-all bg-white shadow-inner"
          >
            <option value="">💭 どんなお仕事がしたい？</option>
            {careers.map((career) => (
              <option key={career.id} value={career.name}>
                {career.name}
              </option>
            ))}
          </select>

          {selectedCareer && (
            <div className="mb-6 p-5 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 shadow-inner">
              <p className="text-gray-700 font-medium leading-relaxed">
                💡 {careers.find((c) => c.name === selectedCareer)?.description}
              </p>
            </div>
          )}

          <button
            onClick={handleOptimize}
            disabled={!selectedCareer || loading}
            className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white
                     py-5 px-8 rounded-2xl font-bold text-xl
                     hover:from-pink-500 hover:via-purple-500 hover:to-blue-500
                     disabled:from-gray-300 disabled:to-gray-400
                     disabled:cursor-not-allowed
                     transition-all transform hover:scale-105 active:scale-95
                     shadow-2xl hover:shadow-pink-300/50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                最適化中...✨
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>あなただけの学習パスを作る</span>
              </span>
            )}
          </button>
        </div>

        {/* スキルツリー表示 */}
        {result && skillTree && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    🌸 {result.career_name}への道
                  </h2>
                  <p className="text-gray-600 font-medium">
                    全{result.total_courses}講座 | 受講済み {completedCourses.filter(id => result.recommended_course_ids.includes(id)).length}講座
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {progressPercentage}%
                  </div>
                  <div className="text-sm text-gray-500">完了率</div>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <SkillTreeCanvas
              initialNodes={skillTree.nodes}
              initialEdges={skillTree.edges}
            />

            {/* 凡例 */}
            <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border-2 border-purple-200">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg shadow-sm"></div>
                <span className="text-gray-700">未受講</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full border-2 border-pink-200">
                <div className="w-5 h-5 bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-300 rounded-lg shadow-sm"></div>
                <span className="text-gray-700">受講済み</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-gray-200 shadow-sm">
                <span className="text-gray-600">💡 ノードをクリックして詳細を見る</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

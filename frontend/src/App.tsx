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

  // 職業一覧の取得
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
      alert('最適化に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // スキルツリーの生成
  const skillTree = result
    ? buildSkillTree(courses, result.stages, completedCourses)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            🐿️ MarmotPath
          </h1>
          <p className="text-gray-600">あなたの学習の道をマーモットと一緒に</p>
        </div>

        {/* 職業選択セクション */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            目指す職業を選択
          </h2>

          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 text-lg
                     focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="">-- 職業を選択してください --</option>
            {careers.map((career) => (
              <option key={career.id} value={career.name}>
                {career.name}
              </option>
            ))}
          </select>

          {selectedCareer && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                {careers.find((c) => c.name === selectedCareer)?.description}
              </p>
            </div>
          )}

          <button
            onClick={handleOptimize}
            disabled={!selectedCareer || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                     py-4 px-6 rounded-lg font-bold text-lg
                     hover:from-blue-600 hover:to-indigo-700
                     disabled:from-gray-300 disabled:to-gray-400
                     disabled:cursor-not-allowed
                     transition-all transform hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                最適化中...
              </span>
            ) : (
              '🚀 学習パスを最適化'
            )}
          </button>
        </div>

        {/* スキルツリー表示 */}
        {result && skillTree && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  学習パス: {result.career_name}
                </h2>
                <p className="text-gray-600 mt-1">
                  合計 {result.total_courses} 講座 |
                  受講済み {completedCourses.length} 講座
                </p>
              </div>
              <div className="text-sm text-gray-500">
                💡 ノードをクリックして詳細を表示
              </div>
            </div>

            <SkillTreeCanvas
              initialNodes={skillTree.nodes}
              initialEdges={skillTree.edges}
            />

            {/* 凡例 */}
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-blue-400 rounded"></div>
                <span>未受講</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-400 rounded"></div>
                <span>受講済み</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

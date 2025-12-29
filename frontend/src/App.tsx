import { useState, useEffect } from 'react';
import { careerApi, optimizationApi } from './services/api';
import type { Career, OptimizationResult } from './types';
import './App.css';

function App() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 職業一覧の取得
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await careerApi.getCareers();
        setCareers(data);
      } catch (error) {
        console.error('Failed to fetch careers:', error);
      }
    };
    fetchCareers();
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          🐿️ MarmotPath
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">職業を選択</h2>

          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">-- 職業を選択してください --</option>
            {careers.map((career) => (
              <option key={career.id} value={career.name}>
                {career.name}
              </option>
            ))}
          </select>

          {selectedCareer && (
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <p className="text-gray-700">
                {careers.find((c) => c.name === selectedCareer)?.description}
              </p>
            </div>
          )}

          <button
            onClick={handleOptimize}
            disabled={!selectedCareer || loading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold
                     hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors"
          >
            {loading ? '最適化中...' : '学習パスを最適化'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              推奨学習パス: {result.career_name}
            </h2>
            <p className="text-gray-600 mb-4">
              合計講座数: {result.total_courses}
            </p>

            {result.stages.map((stage) => (
              <div key={stage.stage_number} className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  Stage {stage.stage_number}
                </h3>
                <ul className="list-disc list-inside pl-4">
                  {stage.course_ids.map((courseId) => (
                    <li key={courseId} className="text-gray-700">
                      {courseId}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

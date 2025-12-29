import { useState, useEffect } from 'react';
import { courseApi, skillApi } from '../../services/api';
import { useProgressStore } from '../../stores/progressStore';
import type { CourseDetail, Skill } from '../../types';

interface Props {
  courseId: string | null;
  onClose: () => void;
}

export default function CourseDetailPanel({ courseId, onClose }: Props) {
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const { isCompleted, addCompletedCourse, removeCompletedCourse } = useProgressStore();

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [detail, skillsList] = await Promise.all([
          courseApi.getCourseDetail(courseId),
          skillApi.getSkills(),
        ]);
        setCourseDetail(detail);
        setSkills(skillsList);
      } catch (error) {
        console.error('Failed to fetch course detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (!courseId) return null;

  const completed = isCompleted(courseId);

  const handleToggleComplete = () => {
    if (completed) {
      removeCompletedCourse(courseId);
    } else {
      addCompletedCourse(courseId);
    }
  };

  // スキルIDから名前を取得
  const getSkillName = (skillId: string) => {
    const skill = skills.find((s) => s.skill_id === skillId);
    return skill ? skill.name : skillId;
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-pink-50 to-purple-50 shadow-2xl overflow-y-auto z-50 border-l-4 border-pink-300">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-gradient-to-r from-pink-100 to-purple-100 border-b-2 border-pink-200 p-5 flex justify-between items-center backdrop-blur-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          📚 講座詳細
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center text-gray-600 hover:text-pink-600 font-bold"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
          <div className="mt-4 text-gray-600">読み込み中...</div>
        </div>
      ) : courseDetail ? (
        <div className="p-6">
          {/* タイトル */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {courseDetail.name}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                {courseDetail.course_id}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-pink-500">⏱️</span>
                <span className="font-semibold text-gray-700">{courseDetail.estimated_hours}時間</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-purple-500">🎯</span>
                <span className="font-semibold text-gray-700">{courseDetail.skills_acquired.length}スキル</span>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              {courseDetail.description}
            </p>
          </div>

          {/* 必須スキル */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
              <span className="text-2xl mr-2">📋</span>
              必須スキル
            </h4>
            {courseDetail.prerequisites.length > 0 ? (
              <div className="space-y-2">
                {courseDetail.prerequisites.map((skillId) => (
                  <div
                    key={skillId}
                    className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {getSkillName(skillId)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-sm font-medium text-green-700 flex items-center gap-2">
                <span className="text-xl">🌱</span>
                初心者でもOK！前提スキルなし
              </div>
            )}
          </div>

          {/* 獲得スキル */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
              <span className="text-2xl mr-2">✨</span>
              獲得できるスキル
            </h4>
            <div className="space-y-2">
              {courseDetail.skills_acquired.map((skillId) => (
                <div
                  key={skillId}
                  className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  🎯 {getSkillName(skillId)}
                </div>
              ))}
            </div>
          </div>

          {/* 推奨組み合わせ */}
          {courseDetail.recommended_combinations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                <span className="text-2xl mr-2">💡</span>
                一緒に受けるとお得
              </h4>
              <div className="space-y-2">
                {courseDetail.recommended_combinations.slice(0, 3).map((recCourseId) => (
                  <div
                    key={recCourseId}
                    className="px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl text-sm font-medium text-gray-800 shadow-sm"
                  >
                    🤝 {recCourseId}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 受講完了ボタン */}
          <button
            onClick={handleToggleComplete}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-white text-lg
              transition-all transform hover:scale-105 active:scale-95 shadow-lg
              ${completed
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                : 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600'
              }
            `}
          >
            {completed ? (
              <span className="flex items-center justify-center gap-2">
                <span>✓</span>
                <span>受講済み</span>
                <span className="text-sm">(タップで解除)</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>受講完了にする</span>
              </span>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

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
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto z-50 border-l-4 border-blue-500">
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">講座詳細</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      ) : courseDetail ? (
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {courseDetail.name}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {courseDetail.course_id}
            </span>
            <span className="text-gray-600">⏱️ {courseDetail.estimated_hours}時間</span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {courseDetail.description}
          </p>

          {/* 必須スキル */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-red-500 mr-2">📋</span>
              必須スキル
            </h4>
            {courseDetail.prerequisites.length > 0 ? (
              <div className="space-y-2">
                {courseDetail.prerequisites.map((skillId) => (
                  <div
                    key={skillId}
                    className="px-3 py-2 bg-red-50 border border-red-200 rounded text-sm"
                  >
                    {getSkillName(skillId)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">なし（初心者向け）</p>
            )}
          </div>

          {/* 獲得スキル */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-green-500 mr-2">🎯</span>
              獲得スキル
            </h4>
            <div className="space-y-2">
              {courseDetail.skills_acquired.map((skillId) => (
                <div
                  key={skillId}
                  className="px-3 py-2 bg-green-50 border border-green-200 rounded text-sm"
                >
                  {getSkillName(skillId)}
                </div>
              ))}
            </div>
          </div>

          {/* 推奨組み合わせ */}
          {courseDetail.recommended_combinations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-purple-500 mr-2">💡</span>
                一緒に受けるとお得な講座
              </h4>
              <div className="space-y-2">
                {courseDetail.recommended_combinations.map((recCourseId) => (
                  <div
                    key={recCourseId}
                    className="px-3 py-2 bg-purple-50 border border-purple-200 rounded text-sm"
                  >
                    {recCourseId}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 受講完了ボタン */}
          <button
            onClick={handleToggleComplete}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold text-white
              transition-colors
              ${completed
                ? 'bg-gray-400 hover:bg-gray-500'
                : 'bg-green-500 hover:bg-green-600'
              }
            `}
          >
            {completed ? '✓ 受講済み（解除）' : '受講完了にする'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

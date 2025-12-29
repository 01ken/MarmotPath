from fastapi import APIRouter, HTTPException
from app.services.data_loader import data_loader
from app.schemas.course import Course, CourseListResponse, CourseDetailResponse

router = APIRouter()


@router.get("/courses", response_model=CourseListResponse)
async def get_courses():
    """全講座の一覧を取得"""
    data = data_loader.load_courses()
    courses = []

    for course_id, info in data["courses_master"].items():
        courses.append(Course(
            id=info["id"],
            course_id=course_id,
            name=info["name"],
            description=info["description"],
            prerequisites=info["prerequisites"],
            skills_acquired=info["skills_acquired"],
            estimated_hours=info["estimated_hours"]
        ))

    # IDでソート
    courses.sort(key=lambda x: x.id)

    return CourseListResponse(courses=courses)


@router.get("/courses/{course_id}", response_model=CourseDetailResponse)
async def get_course_detail(course_id: str):
    """講座の詳細情報を取得"""
    courses_data = data_loader.load_courses()
    combinations_data = data_loader.load_combinations()

    if course_id not in courses_data["courses_master"]:
        raise HTTPException(status_code=404, detail="Course not found")

    info = courses_data["courses_master"][course_id]

    # この講座が含まれる組み合わせを検索
    recommended_combinations = []
    for comb_id, comb_info in combinations_data["course_combinations"].items():
        if course_id in comb_info["courses"]:
            # 他の講座を推奨として追加
            other_courses = [c for c in comb_info["courses"] if c != course_id]
            recommended_combinations.extend(other_courses)

    return CourseDetailResponse(
        id=info["id"],
        course_id=course_id,
        name=info["name"],
        description=info["description"],
        prerequisites=info["prerequisites"],
        skills_acquired=info["skills_acquired"],
        estimated_hours=info["estimated_hours"],
        recommended_combinations=list(set(recommended_combinations))  # 重複削除
    )


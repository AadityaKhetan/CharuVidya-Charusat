export interface ICourseCategory {
  id?: number;
  courseCategoryTitle?: string;
  logo?: string;
  isParent?: boolean;
  parentId?: number;
}

export class CourseCategory implements ICourseCategory {
  constructor(
    public id?: number,
    public courseCategoryTitle?: string,
    public logo?: string,
    public isParent?: boolean,
    public parentId?: number
  ) {}
}

export function getCourseCategoryIdentifier(courseCategory: ICourseCategory): number | undefined {
  return courseCategory.id;
}

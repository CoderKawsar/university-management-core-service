export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourseRequest[];
};

export type IPreRequisiteCourseRequest = {
  courseId: string;
  isDeleted?: boolean;
};

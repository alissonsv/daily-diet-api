export interface Meal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  datetime: Date;
  within_diet: boolean;
}

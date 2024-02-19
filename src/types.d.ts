export interface ApiMeal {
    type: string,
    description: string,
    calories: string,
    date: Date,
} 

export interface Meal extends ApiMeal{
    id: string, 
}

export interface ApiTypeMeal {
    id: string,
    title: string,
}
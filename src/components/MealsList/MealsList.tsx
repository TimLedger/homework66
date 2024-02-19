import { useCallback, useEffect, useState } from 'react';
import Preloader from '../Preloader/Preloader';
import axiosApi from '../../axiosApi';
import { Meal, ApiMeal } from '../../types';
import { Link } from 'react-router-dom';
import './MealsList.css';
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";

interface TotalCaloriesProps {
  onTotalCalories: (caloriesNumber: number) => void;
} 

const MealsList: React.FC<TotalCaloriesProps> = ({ onTotalCalories }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<{[key: string]: boolean}>({});

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get<Record<string, ApiMeal> | null>('/meals.json');
      const meals = response.data;
  
      if (meals) {
        const today = new Date().toLocaleDateString();
        const sortedMeals = Object.keys(meals)
        .map(id => ({ ...meals[id], id }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMeals(sortedMeals);
        const caloriesNumber = sortedMeals
        .filter(meal => new Date(meal.date).toLocaleDateString() === today)
        .reduce((acc, meal) => acc + parseInt(meal.calories), 0);
        onTotalCalories(caloriesNumber);
      } else {
        setMeals([]);
        onTotalCalories(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMeals();
  }, [fetchMeals]);

  const deleteMeal = async (mealId: string) => {
    setDeleteLoading(prevState => ({
      ...prevState,
      [mealId]: true 
    }));
    try {
      if (confirm('Вы точно хотите удалить эту запись?')) {
        await axiosApi.delete('/meals/' + mealId + '.json');
        await fetchMeals();
      }
    } finally {
      setDeleteLoading(prevState => ({
        ...prevState,
        [mealId]: false 
      }));
    }
  };

  let load = <Preloader />;

  if (loading) {
    load = <Preloader />;
  } else if (meals.length > 0) {
    load = (
      <div className='records-list'>
        {meals.map(meal => (
        <div key={meal.id} className="record"> 
          <div className="record-frame">
            <h2 className='record-type'>{meal.type}</h2>
            <p className="record-description">{meal.description}</p>
            <p className="record-date">{new Date(meal.date).toLocaleDateString()}</p>
          </div>
          <span className='record-calories'>{meal.calories} kcal</span>
          <div className="record-btns">
            <button
              className='tooltip-container'
              onClick={() => deleteMeal(meal.id)}
              disabled={deleteLoading[meal.id]} 
            >
              { deleteLoading[meal.id] ? <Preloader /> : <AiTwotoneDelete />}
              <span className='tooltip'>Удалить</span>
            </button>
            <Link 
              className='tooltip-container' 
              to={'/meals/' + meal.id + '/edit/'}>
                <AiTwotoneEdit />
                <span className='tooltip'>Изменить</span>
            </Link>
          </div>
        </div>
        ))}
      </div>
    );
  } else {
    load = <h1>Записей о приемах пищи пока нет...</h1>;
  }

  return (
    <div className='page-body'>
      {load}
    </div>
  );
};

export default MealsList;

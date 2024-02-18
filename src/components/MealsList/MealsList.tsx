import { useCallback, useEffect, useState } from 'react';
import Preloader from '../Preloader/Preloader';
import axiosApi from '../../axiosApi';
import { Meal, ApiMeal } from '../../types';
import { Link } from 'react-router-dom';
import './MealsList.css';
import { AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";

const DatesList = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosApi.get<Record<string, ApiMeal> | null>('/meals.json');
      const meals = response.data;

      if (meals) {
        const reversedMeals = Object.keys(meals).map(id => ({
          ...meals[id],
          id
        })).reverse();
        setMeals(reversedMeals);
      } else {
        setMeals([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMeals();
  }, [fetchMeals]);

  const deleteMeal = async (mealId: string) => {
    if (confirm('Вы точно хотите удалить эту запись?')) {
      await axiosApi.delete('/meals/' + mealId + '.json');
      await fetchMeals();
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
          </div>
          <span className='record-calories'>{meal.calories} kcal</span>
          <div className="record-btns">
            <button className='tooltip-container' onClick={() => deleteMeal(meal.id)}><AiTwotoneDelete /><span className='tooltip'>Удалить</span></button>
            <Link className='tooltip-container' to={'/meals/' + meal.id + '/edit/'}><AiTwotoneEdit /><span className='tooltip'>Изменить</span></Link>
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

export default DatesList;

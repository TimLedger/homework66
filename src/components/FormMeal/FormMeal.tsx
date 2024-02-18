import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import { ApiMeal, ApiTypeMeal } from '../../types';
import axiosApi from '../../axiosApi';
import './FormMeal.css';

const FormMeal: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filling, setFilling] = useState<ApiMeal>({
    type: '',
    description: '',
    calories: 0,
  });
  const [types, setTypes] = useState<ApiTypeMeal[] | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const response = await axiosApi.get('/meals-type.json');
      const categoriesData: ApiTypeMeal[] = Object.values(response.data);
      setTypes(categoriesData);
    };

    void fetchTypes();
  }, []);

  useEffect(() => {
    const fetchMeal = async () => {
      if (params.id) {
        try {
          setLoading(true);
          const response = await axiosApi.get('/meals/' + params.id + '.json');
          const mealData = response.data;
          setFilling({
            type: mealData.type,
            description: mealData.description,
            calories: mealData.calories,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    void fetchMeal();
  }, [params.id]);

  const mealChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'type') {
      setFilling((prevState) => ({
        ...prevState,
        type: value,
      }));
    } else {
      setFilling((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (params.id) {
        await axiosApi.put('/meals/' + params.id + '.json', filling);
      } else {
        await axiosApi.post('/meals.json', filling);
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  let button = (
    <button type="submit" className="form-submit-btn">
     {params.id ? 'Сохранить' : 'Создать запись'}
    </button>
  );

  if (loading) {
    button = <Preloader />;
  }

  return (
    <div className="form-frame">
      <form onSubmit={onFormSubmit} autoComplete="off" className="form">
        <select
          id="type"
          name="type"
          className="form-select"
          required
          value={filling.type}
          onChange={mealChanged}
        >
          <option value="" className='form-option'>Прием пищи</option>
          {types &&
            types.map((type) => (
              <option key={type.id} value={type.id} className='form-option'>
                {type.title}
              </option>
          ))}
        </select>
        <textarea
          id="description"
          name="description"
          className="form-input"
          rows={10}
          required
          value={filling.description}
          onChange={mealChanged}
          placeholder='Описание'
        />
        <input
          id="calories"
          type="number"
          name="calories"
          className="form-input"
          required
          value={filling.calories}
          onChange={mealChanged}
          placeholder='Калории'
        />
        {button}
      </form>
    </div>
  );
};

export default FormMeal;

import { useState } from 'react';
import MealsList from '../../components/MealsList/MealsList';
import Total from '../../components/Total/Total';

const Home = () => {
  const [totalCalories, setTotalCalories] = useState<number>(0);

  const handleTotalCalories = (caloriesNumber: number) => {
    setTotalCalories(caloriesNumber);
  };
  
  return (
    <div>
      <Total totalCalories={totalCalories}/>
      <MealsList onTotalCalories={handleTotalCalories}/>
    </div>
  );
}

export default Home;
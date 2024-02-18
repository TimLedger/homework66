import { Link } from 'react-router-dom';
import { IoAdd } from "react-icons/io5";
import './Total.css';


const Total = () => {
  return (
    <div className='total-frame'>
        <span>Всего каллорий: </span>
        <Link className='tooltip-container' to="/meals/new"><IoAdd /><span className='tooltip tooltip-big'>Новая запись</span></Link>
    </div>
  );
}

export default Total;
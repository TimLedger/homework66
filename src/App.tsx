import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './containers/Home/Home';
import AddMeal from './containers/AddMeal/AddMeal';
import FormMeal from './components/FormMeal/FormMeal';
import NotFound from './containers/NotFound/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="page-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meals/new" element={<AddMeal />}/>
            <Route path="/meals/:id/edit" element={<FormMeal/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
// Products.js
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
 
const Budget = () => {
   const navigate = useNavigate();
   const {totalSpent} = useCategories();
   return (
      <div>
        {/* <h1>Budget here</h1>   */}
        <div className='header-summary-sec'>
         <div className='total-budget'></div>
         <div className='total-spent'>{totalSpent}</div>
         <div className='total-remaining'></div>
        </div>

      </div>
   );
};
 
export default Budget;
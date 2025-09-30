import CustomerList from "../../../components/customers/CustomerList";
import '../../../styles/components/customers/customers.scss';

function customersList() {




  return (
  
    <section className="customers global-margin">
   
 

 <CustomerList isEditMode={false}/>
   
   
   
     </section>
   
  )
}

export default customersList
import DashboardMenuItems from "../../components/dashboard menu items/DashboardMenuItems";
import { useBreadcrumbs } from "../../store/context/BreadcrumbsContext";
import { useEffect } from "react";

function TodosPage() {


const { setBreadcrumbs } = useBreadcrumbs();


   useEffect(() => {
          setBreadcrumbs([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Todos', path: '/dashboard/todos' }
          ]);
      }, [setBreadcrumbs]);

  return (
     

    <section className="todos-page global-margin">




        <DashboardMenuItems/>
    </section>
  )
}

export default TodosPage
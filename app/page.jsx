import Homepage from "./Homepage/page";
import Mainpage from "./Mainpage/page";

import TaskTable from "./TaskTable/page";

export default function Home() {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
      {/* <Mainpage /> */}
      {/* <TaskTable /> */}
      <Homepage />
    </div>
  );
}

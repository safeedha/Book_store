import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

import { toast } from 'sonner';
import { getUser, userStatusUpdate,getPage } from './AdminApi/User';
import Swal from 'sweetalert2';
import Pagination from '../Reusable/Pagination';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../feature/adminSlice';

function Getcustomer() {
  const dispatch = useDispatch();

  const [user, setUser] = useState([]);
  const [itemsPerPage] = useState(5);
  const [username, setUsername] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        await getUser(page,itemsPerPage,setTotalPages,setUser, dispatch, logoutAdmin);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomer();
  }, [page,dispatch,itemsPerPage]);



  const Editblock = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the status of this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    });

    if (result.isConfirmed) {
      const current = user.find((doc) => doc._id === id);
      let status = current.status;
      status = status === 'unblock' ? 'block' : 'unblock';
      try {
        await userStatusUpdate(
          id,
          setUser,
          status,
          user,
          dispatch,
          logoutAdmin
        );
      } catch (error) {
        if(error)
        {
         toast.error('Some error occurred. Try again later.');
        }
        
      }
    }
  };




  const Search = async() => {
       await getPage(username)  
  };
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="bg-gray-200 min-h-screen min-w-full">
        <div className="flex-1 ml-60 p-6 ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customers</h2>

            <div className="flex items-center gap-2">
              {/* <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name..."
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={Search}
                className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200"
              >
                Search
              </button> */}
            </div>
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">
                  Customer Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Customer Email
                </th>
                <th className="border border-gray-300 px-4 py-2">Mobile No</th>
                <th className="border border-gray-300 px-4 py-2">
                  Signup Method
                </th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {user.map((doc) => (
                <tr key={doc._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {doc.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {doc.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {doc.mobileNo ? doc.mobileNo : 'null'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {doc.googleId ? 'Google' : 'Manual'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => Editblock(doc._id)}
                      className="border border-indigo-600 bg-indigo-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200 mr-4"
                    >
                      {doc.status === 'unblock' ? 'BLOCK' : 'UNBLOCK'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Getcustomer;

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
const Manager = () => {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ appname: "", username: "", pass: "" });
  const [passArray, setPassArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDel, setIddel] = useState();
  const [editId, setEditId] = useState(null);
  const fetchPasswords = async () => {
    try {
      const res = await axios.get(
        "https://backend-password-manager-production.up.railway.app/api/users/"
      );
      setPassArray(res.data);
    } catch (error) {
      console.error("Error fetching passwords:", error);
      toast.error("Error fetching passwords");
    }
  };

  // Ensure it runs when component mounts
  useEffect(() => {
    fetchPasswords();
  }, []);
  const showPassword = () => {
    if (!show) {
      ref.current.src = "./icons/hide.svg";
    } else {
      ref.current.src = "./icons/view.svg";
    }
    setShow(!show);
  };
  const savePassword = async () => {
    if (
      form.appname.trim() === "" ||
      form.username.trim() === "" ||
      form.pass.trim() === ""
    ) {
      toast("🦄 Please fill all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    const payload = {
      appname: form.appname,
      username: form.username,
      password: form.pass,
    };

    try {
      if (editId) {
        // **Update existing entry**
        await axios.put(
          `https://backend-password-manager-production.up.railway.app/api/users/update/${editId}`,
          payload
        );
        toast.success("Password updated successfully!");
      } else {
        // **Create new entry**
        await axios.post(
          "https://backend-password-manager-production.up.railway.app/api/users/register",
          payload
        );
        toast.success("Password saved successfully!");
      }

      await fetchPasswords(); // **Fetch updated passwords after update**
      setForm({ appname: "", username: "", pass: "" }); // Clear form
      setEditId(null); // Reset edit mode
    } catch (error) {
      console.error(
        "Error saving password:",
        error.response?.data || error.message
      );
      toast.error("Failed to save password!");
    }
  };

  //   if(form.appname.length===0 || form.username.length===0 || form.pass.length ===0){
  //     toast("🦄 Please fill all the fields", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //     return;
  //   }
  //   console.log(form);
  //   setPassArray([...passArray, { ...form, id: uuidv4() }]);
  //   localStorage.setItem(
  //     "passwords",
  //     JSON.stringify([...passArray, { ...form, id: uuidv4() }])
  //   );
  //   // console.log([...passArray, form]);
  //   console.log(localStorage.getItem("passwords"));
  //   const payload = {
  //     appname: form.appname, // Change to match backend
  //     username: form.username,
  //     password: form.pass,  // Change to match backend
  //   };
  //   try {
  //     const res = await axios.post("https://backend-password-manager-production.up.railway.app/api/users/register", payload);
  //     console.log(res.data);
  //     toast("🦄 Saved Password", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //     toast("🦄 Error", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "dark",
  //     });
  //   }
  //   setForm({ appname: "", username: "", pass: "" });

  // };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };
  const copyText = (params) => {
    navigator.clipboard.writeText(params);
    toast("🦄 Copied", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const deleteHandler = async () => {
    try {
      await axios.delete(
        `https://backend-password-manager-production.up.railway.app/api/users/delete/${idDel}`
      );
      let updatedForm = passArray.filter((item) => item.id !== idDel);
      // setPassArray([...updatedForm]);
      const { data } = await axios.get(
        "https://backend-password-manager-production.up.railway.app/api/users"
      );
      setPassArray(data);
      setIsModalOpen(false);
      toast("🦄 Deleted Password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.error("Error deleting password");
    }
  };
  const editHandler = (id) => {
    const selectedItem = passArray.find((item) => item._id === id);
    if (!selectedItem) return; // Prevent errors if the item is not found

    setForm({
      appname: selectedItem.appname,
      username: selectedItem.username,
      pass: selectedItem.password, // Ensure correct field names
    });
    setEditId(id);
    // No need to remove the item from the state at this step
  };
  const handleDelete = (id) => {
    setIddel(id);
    setIsModalOpen(true);
    console.log(id);
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-32 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col"></div>
      <div className="container bg-slate-900 mx-auto md:p-10 p-4 py-6 pb-36 rounded-md flex flex-col gap-4 md:mt-16 md:max-h-[70vh] max-h-[90vh] overflow-y-auto">
        <h1 className="text-white text-center text-2xl md:text-4xl font-bold">
          <span className="text-green-400">&lt;</span>Pass
          <span className="text-green-400">Info/&gt;</span>
        </h1>
        <p className="text-green-400 text-center text-xl">
          Your Own Password Manager
        </p>
        <div className="text-white flex  flex-col gap-4">
          <input
            value={form.appname}
            onChange={handleChange}
            placeholder="Enter Your Application Name"
            className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold"
            type="text"
            name="appname"
            id="appname"
          />
          <div className="flex md:flex-row flex-col gap-3 w-full relative">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your Username"
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold"
              type="text"
              name="username"
              id="username"
            />
            <input
              value={form.pass}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className="rounded-lg border-2 w-full outline-green-500 text-green-700 border-green-500 px-4 py-2 text-lg font-semibold
                "
              type={show ? "text" : "password"}
              name="pass"
              id="pass"
            />
            <img
              ref={ref}
              className="absolute right-2 top-3 cursor-pointer"
              src="./icons/view.svg"
              alt="view"
              onClick={showPassword}
            />
          </div>
          <button
            onClick={savePassword}
            className="bg-green-400 p-3 text-black font-bold rounded-md flex justify-center items-center hover:bg-green-300 transition-all"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              className="mr-2"
            ></lord-icon>
            Add Password
          </button>
          {passArray.length === 0 && (
            <div className="text-2xl text-center mt-3">
              No Data Available Till Now
            </div>
          )}
          {passArray.length != 0 && (
            <table className="table-auto w-full bg-green-100 mt-2 rounded-md overflow-hidden">
              <thead className="bg-green-700">
                <tr>
                  <th className="md:text-xl text-sm py-3">Application Name</th>
                  <th className="md:text-xl text-sm py-3">Username</th>
                  <th className="md:text-xl text-sm py-3">Password</th>
                  <th className="md:text-xl text-sm py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {passArray.map((items) => (
                  <tr key={items._id}>
                    <td className="py-2 border-1 border-white w-32 text-center">
                      {items.appname}
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {items.username}
                        <lord-icon
                          src="https://cdn.lordicon.com/jyjslctx.json"
                          trigger="hover"
                          colors="primary:#000000"
                          className="cursor-pointer"
                          onClick={() => {
                            copyText(items.username);
                          }}
                        ></lord-icon>
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {items.password}
                        <lord-icon
                          src="https://cdn.lordicon.com/jyjslctx.json"
                          trigger="hover"
                          colors="primary:#000000"
                          className="cursor-pointer"
                          onClick={() => {
                            copyText(items.password);
                          }}
                        ></lord-icon>
                      </div>
                    </td>
                    <td className="py-2 border-1 w-32 text-center">
                      <div className="flex justify-center md:flex-row flex-col md:gap-0 gap-2 items-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/ifsxxxte.json"
                          trigger="hover"
                          colors="primary:blue"
                          className="md:mr-3 cursor-pointer"
                          onClick={() => {
                            editHandler(items._id);
                          }}
                        ></lord-icon>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          colors="primary:red"
                          className="cursor-pointer"
                          onClick={() => {
                            handleDelete(items._id);
                          }}
                        ></lord-icon>
                      </div>
                      <ConfirmModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={() => {
                          deleteHandler();
                        }}
                        message="Are you sure you want to delete?"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;

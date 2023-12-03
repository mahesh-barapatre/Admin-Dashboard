import { useEffect, useState } from "react";
import Heading from "./components/Heading";
import axios from "axios";
import Value from "./components/Value";
import ReactPaginate from "react-paginate";
import Input from "./components/Input";
import { Icon } from "@iconify/react";

function App() {
  const deleteSelected = () => {
    const newList = userData.filter((user) => {
      return !selectedRows.includes(user.id);
    });

    setUserData(newList);
  };

  const [isAllRowsChecked, setIsAllRowsChecked] = useState(false);

  const handleRows = () => {
    // if (isAllRowsChecked) {
    //   console.log(selectedRows);
    //   setSelectedRows(selectedRows.splice({ startIndex }, 10));
    // }
    if (isAllRowsChecked) {
      // console.log(selectedRows);

      // Create a copy of the selectedRows array
      const newSelectedRows = [...selectedRows];

      // Use splice to remove elements from the copy
      console.log(startIndex)
      newSelectedRows.splice(startIndex, 10);

      // Update the state with the modified copy
      setSelectedRows(newSelectedRows);
    }

    // else {
    //   let x = 1;
    //   while (x <= 10) {
    //     console.log(x)
    //     if (!selectedRows.includes(`${startIndex + x}`)) {
    //       console.log(`${startIndex + x}`);
    //       setSelectedRows([...selectedRows, `${startIndex+x}`]);
    //     }
    //     x++;
    //   }
    // }
    else {
      setSelectedRows((prevSelectedRows) => {
        let newSelectedRows = [...prevSelectedRows];
        let x = 1;
        while (x <= 10) {
          // console.log(x);
          const newRow = `${startIndex + x}`;
          if (!newSelectedRows.includes(newRow)) {
            // console.log(newRow);
            newSelectedRows.push(newRow);
          }
          x++;
        }
        return newSelectedRows;
      });
    }
    console.log(selectedRows);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const checkSelectedAll = () => {
    for (let x = 1; x <= 10; x++) {
      if (!selectedRows.includes(`${startIndex + x}`)) {
        // console.log(isAllRowsChecked);
        return setIsAllRowsChecked(false);
      }
    }
    setIsAllRowsChecked(true);
  };

  useEffect(() => {
      checkSelectedAll();
  }, [selectedRows]);


  const handleCheckboxChange = (userId) => {
    // Toggle the selection state of the checkbox
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        // If already selected, remove from the array
        return prevSelectedRows.filter((id) => id !== userId);
      } else {
        // If not selected, add to the array
        return [...prevSelectedRows, userId];
      }
    });
  };

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editableRow, setEditableRow] = useState(null);

  const resetEditState = () => {
    setEditEmail("");
    setEditName("");
    setEditRole("");
  };

  const handleEditClick = (userId) => {
    // Set the editable row to the clicked user ID
    setEditableRow(userId);
  };

  const handleSaveClick = (userId) => {
    // Save the changes and update the userData state
    // You might want to implement logic to handle the actual saving of data
    editValue(userId);
    resetEditState();
    setEditableRow(null);
  };

  // Cancel the editing and reset the editableRow state
  const handleCancelClick = () => {
    resetEditState();
    setEditableRow(null);
  };

  const [userData, setUserData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("name");

  useEffect(() => {
    const Data = async () => {
      await axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((res) => {
          // console.log(res.data);
          // console.log(typeof(res.data));
          setUserData(res.data);
          // console.log(userData);
        })
        .catch((err) => console.log(err));
    };
    Data();
  }, []);

  const deleteUser = (userId) => {
    const updatedUsers = userData.filter((user) => user.id !== userId);
    // console.log(updatedUsers);
    setUserData(updatedUsers);
  };

  const editValue = (userId) => {
    let newData = {
      name: editName,
      email: editEmail,
      role: editRole,
    };
    // console.log(newData)
    let updatedUserList = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, ...newData };
      } else {
        return user;
      }
    });
    setUserData(updatedUserList);
  };

  //pagination setup

  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = userData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(userData.length / itemsPerPage);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchHandler();
    }
  };

  const searchHandler = async () => {
    // console.log(searchValue)
    // console.log(searchField)

    //api calling
    await axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        // setUserData(res.data);
        console.log(res.data);
        let filterData = res.data.filter((item) => {
          console.log(item[searchField]);
          console.log(item.name);
          return item[searchField] === searchValue;
        });
        // console.log(filterData)
        setUserData(filterData);
      })
      .catch((err) => console.log(err));

    setSearchValue(""); 
  };

  return (
    <div className="p-4 h-screen w-screen">
      <div className="flex justify-between items-center h-4">
        <div className="flex items-center">
          <select
            value={searchField}
            id="field"
            className="m-2 w-20 p-1 rounded-sm border border-solid"
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <input
            className="m-2 w-1/2 p-1 rounded-sm border border-solid"
            type="text"
            name="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            id="search"
            placeholder="Search Value..."
            onKeyDown={handleKeyPress}
          />
          <div
            className="p-1 rounded-sm bg-blue-500 text-white cursor-pointer"
            onClick={() => searchHandler()}
          >
            <Icon icon="ic:round-search" color="white" width="26" height="26" />
          </div>
        </div>
        <div
          className=" h-max w-max cursor-pointer"
          onClick={() => deleteSelected()}
        >
          <Icon
            icon="icon-park-twotone:delete"
            color="red"
            width="26"
            height="26"
          />
        </div>
      </div>
      <div className="col flex justify-evenly items-center my-4 border border-solid border-gray-200">
        <input
          type="checkbox"
          className="w-1/12"
          onChange={() => handleRows()}
          checked={isAllRowsChecked}
        />
        <Heading name={"Name"} w={"w-3/12"} />
        <Heading name={"Email"} w={"w-4/12"} />
        <Heading name={"Role"} w={"w-2/12"} />
        <Heading name={"Actions"} w={"w-2/12"} />
      </div>
      {currentItems.map((user) => {
        return (
          <div
            key={user.id}
            className={
              "flex justify-evenly items-center p-2 border border-solid border-gray-200"
            }
            style={{
              backgroundColor: selectedRows.includes(user.id)
                ? "#E8E9EB"
                : "white",
            }}
          >
            <input
              type="checkbox"
              className="w-1/12"
              onChange={() => {
                handleCheckboxChange(user.id);
              }}
              checked={selectedRows.includes(user.id)}
            />
            {editableRow === user.id ? (
              <Input
                placeholder={"update name..."}
                value={editName}
                setValue={setEditName}
              />
            ) : (
              <Value name={user.name} w={"w-3/12"} />
            )}
            {editableRow === user.id ? (
              <Input
                placeholder={"update email..."}
                value={editEmail}
                setValue={setEditEmail}
              />
            ) : (
              <Value name={user.email} w={"w-4/12"} />
            )}
            {editableRow === user.id ? (
              <Input
                placeholder={"update role..."}
                value={editRole}
                setValue={setEditRole}
              />
            ) : (
              <Value name={user.role} w={"w-2/12"} />
            )}

            <div className="flex w-2/12 justify-start text-centre">
              <div
                className="h-max w-max cursor-pointer"
                onClick={() => deleteUser(user.id)}
              >
                <Icon
                  icon="ic:twotone-delete"
                  color="red"
                  width="26"
                  height="26"
                />
              </div>

              {editableRow === user.id ? (
                <>
                  <button
                    onClick={() => handleSaveClick(user.id)}
                    className=" h-max w-max "
                  >
                    <Icon
                      icon="mingcute:save-fill"
                      color="lightgreen"
                      width="26"
                      height="26"
                    />
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="mr-1 h-max w-max"
                  >
                    <Icon
                      icon="basil:cancel-solid"
                      color="red"
                      width="28"
                      height="28"
                    />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(user.id)}
                    className="bg-blue-500 mr-1 text-white h-max w-max text-center rounded-sm"
                  >
                    <Icon
                      icon="uil:edit"
                      color="white"
                      width="26"
                      height="26"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      <div className="footer flex justify-between w-full fixed bottom-3 right-2 left-2">
        <div className="">
          {selectedRows.length} of {userData.length} row(s) selected.
        </div>

        <div className="flex justify-center items-center ">
          <h5 className="font-semibold mr-2">
            Page {currentPage + 1} of {totalPages}{" "}
          </h5>
          <div
            className="ml-1 cursor-pointer"
            onClick={() => setCurrentPage(0)}
          >
            <Icon icon="wpf:first" color="skyblue" width="26" height="26" />
          </div>
          {/* pagination setup */}
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            breakClassName="break-me rounded-sm border border-solid border-blue-300 p-2"
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName="pagination w-max flex justify-centre p-2 h-max"
            activeClassName="active bg-blue-500 text-white font-bold"
            pageClassName="rounded-sm border border-solid border-blue-300 px-2 mx-1"
            previousClassName="rounded-sm border font-bold border-solid border-blue-300 px-2 mx-1"
            nextClassName="rounded-sm border font-bold border-solid border-blue-300 px-2 mx-1"
          />
          <div
            className="mr-1 cursor-pointer"
            onClick={() => setCurrentPage(totalPages - 1)}
          >
            <Icon
              icon="wpf:first"
              color="skyblue"
              width="26"
              height="26"
              rotate={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import CloseIcon from "../../../re_use/CloseIcon";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Loading from "../../../re_use/Loading";
import axiosInterceptor from "../../../helpers/axiosInterceptor";
import { useFormik } from "formik";
import { addEmpSchema } from "../../../schemas/validation";
import { Pagination } from "antd";
import ShowIcon from "../../../re_use/ShowIcon";

const Employees = () => {
  const [department, setDepartment] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [page, setPage] = useState(1);

  const initialValuesOfAddNewEmp = {
    empName: "",
    empEmail: "",
    empMobile: "",
    empId: "",
    password: "",
    empDept: "",
    empDesign: "",
  };
  //all designation data
  const [designation, setDesignation] = useState([]);

  //all employee data
  const [empDetails, setEmpDetails] = useState([]);

  const [totalEmp, setTotalEmp] = useState();
  console.log(totalEmp);
  const [totalPages, setTotalPages] = useState();
  // console.log(totalPages);
  //tab section
  const [activeTab, setActiveTab] = useState("tab1");
  // individual emp id from table row state
  const [individualEmp, setIndividualEmp] = useState();

  //edit existing emp details
  const [tabelF, setTableF] = useState();
  const [newName, setNewName] = useState(individualEmp?.name);

  const [newEmpId, setNewEmpId] = useState(individualEmp?.email);
  const [newUserId, setNewUserId] = useState(individualEmp?.emp_id);
  const [newPass, setNewPass] = useState(individualEmp?.password);
  const [newMob, setNewMob] = useState(individualEmp?.mobile);
  const [newTeam, setNewTeam] = useState(individualEmp?.department);
  const [newDesignation, setNewDesignation] = useState(
    individualEmp?.designation
  );

  const initialValuesEditEmp = {
    newName: individualEmp?.name,
    newEmpId: individualEmp?.email,
    newUserId: individualEmp?.emp_id,
    newPass: individualEmp?.password,
    newMob: individualEmp?.mobile,
    newTeam: individualEmp?.department,
    newDesignation: individualEmp?.designation,
  };
  const [btnLoader, setBtnLoader] = useState(true);
  const [search, setSearch] = useState("");
  const fetchAllDepartment = () => {
    axiosInterceptor.get(`/get-all-department`).then((res) => {
      return setDepartment(res.data.result);
    });
  };
  const fetchAllDesignation = () => {
    axiosInterceptor.get(`/get-all-designation`).then((res) => {
      return setDesignation(res.data.result);
    });
  };

  const getAllEmployee = (page) => {
    axiosInterceptor
      .get(`/get-all-employee?page=${page}&limit=10&search=`)
      .then((res) => {
        return (
          console.log(res),
          setEmpDetails(res.data.result.listOfEmployee),
          setTotalEmp(res.data.result.totalEmployee),
          setBtnLoader(false),
          setTotalPages(res.data.result.numberOfPage)
        );
      });
  };
  const getIndEmp = (i) => {
    let emp_id = i;
    setTableF(emp_id);

    axiosInterceptor.get(`/get-employee?employee_id=${emp_id}`).then((res) => {
      setIndividualEmp(res.data.result);
    });
  };

  const saveNewEmp = (e) => {
    e.preventDefault();
    axiosInterceptor
      .put(`/update-employee?employee_id=${tabelF}`, {
        name: newName,
        emp_id: newUserId,
        email: newEmpId,
        mobile: newMob,
        password: newPass,
        department: newTeam,
        designation: newDesignation,
      })
      .then((res) => {
        getIndEmp();
        getAllEmployee(1);
        toast.success(res.data.message);
      });
  };

  const deleteemp = () => {
    axiosInterceptor
      .delete(`/delete-employee?employee_id=${tabelF}`)
      .then((res) => {
        getAllEmployee(1);
        toast.success(res.data.message);
      });
  };
  useEffect(() => {
    // axiosInterceptor
    //   .get(`/get-all-employee?page=1&limit=10&search=ghhtro`)
    //   .then((res) => {
    //     console.log(res);
    //   });

    getAllEmployee(page);
    fetchAllDepartment();
    fetchAllDesignation();
  }, []);

  const filteredEmpDetails = !search
    ? dataSource
    : dataSource.filter(
        (person) =>
          person.name.toLowerCase().includes(search.toLowerCase()) ||
          person.emp_id.toLowerCase().includes(search.toLowerCase()) ||
          person.designation.toLowerCase().includes(search.toLowerCase())
      );

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValuesOfAddNewEmp,
      validationSchema: addEmpSchema,
      onSubmit: (values, action) => {
        axiosInterceptor
          .post(`/add-employee`, {
            name: values.empName,
            emp_id: values.empId,
            email: values.empEmail,
            mobile: values.empMobile,
            password: values.password,
            department: values.empDept,
            designation: values.empDesign,
          })
          .then((res) => {
            toast.success(res.data.message);
            getAllEmployee(1);
            action.resetForm();
          })
          .catch((error) => {
            toast.error(error.data.message);
          });
      },
    });

  const searchEmp = () => {
    axiosInterceptor
      .get(`/get-all-employee?page=1&limit=10&search=${search}`)
      .then((res) => {
        setDataSource(res.data.result.listOfEmployee);
      });
  };
  return (
    <div>
      <div className="tab_content">
        <p className="pt-1">Employees &#40;{totalEmp}&#41;</p>
        <div className="emp_input">
          <svg
            className="emp_slogo"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="7.82492"
              cy="7.82495"
              r="6.74142"
              stroke="#646464"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.5137 12.8638L15.1567 15.5"
              stroke="#646464"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <input
            className="emp_input_box"
            placeholder="Search by name, Designation, employee ID"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <button className="input_search" onClick={searchEmp}>
            Search
          </button>

          <button className="download_btn">
            Download Report
            <svg
              style={{ marginLeft: 10, marginRight: 10 }}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.00002 8.38317C5.91113 8.38317 5.8278 8.36917 5.75002 8.34117C5.67224 8.31362 5.60002 8.2665 5.53335 8.19984L3.13335 5.79984C3.01113 5.67762 2.95002 5.52206 2.95002 5.33317C2.95002 5.14428 3.01113 4.98873 3.13335 4.8665C3.25558 4.74428 3.4138 4.68028 3.60802 4.6745C3.80269 4.66917 3.96113 4.72761 4.08335 4.84984L5.33335 6.09984V1.33317C5.33335 1.14428 5.39735 0.985837 5.52535 0.857837C5.65291 0.730282 5.81113 0.666504 6.00002 0.666504C6.18891 0.666504 6.34735 0.730282 6.47535 0.857837C6.60291 0.985837 6.66669 1.14428 6.66669 1.33317V6.09984L7.91669 4.84984C8.03891 4.72761 8.19735 4.66917 8.39202 4.6745C8.58624 4.68028 8.74446 4.74428 8.86669 4.8665C8.98891 4.98873 9.05002 5.14428 9.05002 5.33317C9.05002 5.52206 8.98891 5.67762 8.86669 5.79984L6.46669 8.19984C6.40002 8.2665 6.3278 8.31362 6.25002 8.34117C6.17224 8.36917 6.08891 8.38317 6.00002 8.38317ZM2.00002 11.3332C1.63335 11.3332 1.31958 11.2027 1.05869 10.9418C0.797354 10.6805 0.666687 10.3665 0.666687 9.99984V8.6665C0.666687 8.47762 0.730465 8.31917 0.85802 8.19117C0.98602 8.06361 1.14446 7.99984 1.33335 7.99984C1.52224 7.99984 1.68069 8.06361 1.80869 8.19117C1.93624 8.31917 2.00002 8.47762 2.00002 8.6665V9.99984H10V8.6665C10 8.47762 10.064 8.31917 10.192 8.19117C10.3196 8.06361 10.4778 7.99984 10.6667 7.99984C10.8556 7.99984 11.0138 8.06361 11.1414 8.19117C11.2694 8.31917 11.3334 8.47762 11.3334 8.6665V9.99984C11.3334 10.3665 11.2029 10.6805 10.942 10.9418C10.6807 11.2027 10.3667 11.3332 10 11.3332H2.00002Z"
                fill="#0A0A0A"
              />
            </svg>
          </button>

          <button
            type="button"
            className="add_emp_btn "
            data-bs-toggle="modal"
            data-bs-target="#addemp_pop_up"
          >
            <svg
              style={{ marginRight: 10, marginLeft: 10 }}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.15152 10V0H5.84848V10H4.15152ZM0 5.84848V4.15152H10V5.84848H0Z"
                fill="black"
              />
            </svg>
            Add Employee
          </button>
          {/* add emp pop up  */}

          <div
            className={`modal fade addemp_pop_up }`}
            id="addemp_pop_up"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1>Add Employee</h1>
                  <button
                    type="button"
                    className="border-0 bg_none"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.46659 17.1666L0.833252 15.5333L7.36659 8.99992L0.833252 2.46659L2.46659 0.833252L8.99992 7.36659L15.5333 0.833252L17.1666 2.46659L10.6333 8.99992L17.1666 15.5333L15.5333 17.1666L8.99992 10.6333L2.46659 17.1666Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="container">
                      <div className="row">
                        <div className="col left_side">
                          <label htmlFor="empName" className="p_light_d">
                            Employee Name
                          </label>
                          <input
                            className="add_emp_input"
                            type="text"
                            id="empName"
                            placeholder="Sample User"
                            value={values.empName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.empName && touched.empName ? (
                            <p className="mt-2 error_mess_addemp">
                              {errors.empName}
                            </p>
                          ) : null}
                          <label htmlFor="empEmail" className="p_light_d">
                            User ID
                          </label>
                          <input
                            className="add_emp_input"
                            type="email"
                            id="empEmail"
                            placeholder="eg. user@cendrol.com"
                            value={values.empEmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          {errors.empEmail && touched.empEmail ? (
                            <p className="mt-2 error_mess_addemp">
                              {errors.empEmail}
                            </p>
                          ) : null}
                          <label htmlFor="empMobile" className="p_light_d">
                            Mobile Number
                          </label>
                          <div className="d-flex ">
                            <div className="numer_91">+91</div>
                            <input
                              id="empMobile"
                              type="number"
                              maxLength={10}
                              onKeyDown={(event) => {
                                const value = event.target.value;
                                if (value.length >= 10 && event.keyCode !== 8) {
                                  event.preventDefault();
                                }
                              }}
                              value={values.empMobile}
                              className="input_feild_number"
                              placeholder="eg.8256XXXX64"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          {errors.empMobile && touched.empMobile ? (
                            <p className="mt-2 error_mess_addemp">
                              {errors.empMobile}
                            </p>
                          ) : null}
                        </div>
                        <div className="col">
                          <label htmlFor="empId" className="p_light_d">
                            Employee ID
                          </label>
                          <input
                            className="add_emp_input"
                            id="empId"
                            placeholder="CEN070"
                            value={values.empId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // onChange={(e) => setEmpId(e.target.value)}
                          />
                          {errors.empId && touched.empId ? (
                            <p className="mt-2 error_mess_addemp">
                              {errors.empId}
                            </p>
                          ) : null}
                          <label htmlFor="empPassword" className="p_light_d">
                            Password
                          </label>
                          <input
                            className="add_emp_input"
                            type="password"
                            id="password"
                            value={values.password}
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // onChange={(e) => setPassword(e.target.value)}
                          />
                          <ShowIcon />
                          {errors.password && touched.password ? (
                            <p className="mt-2 error_mess_addemp">
                              {errors.password}
                            </p>
                          ) : null}
                          <label htmlFor="empDept" className="p_light_d">
                            Team
                          </label>
                          <select
                            id="empDept"
                            value={values.empDept}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // onChange={(e) => setDept(e.target.value)}
                          >
                            <option>Choose team</option>
                            {department?.map((data) => {
                              return (
                                <option value={data._id}>
                                  {data.department}
                                </option>
                              );
                            })}
                          </select>
                          {errors.empDept && touched.empDept ? (
                            <p className=" error_mess_addemp">
                              {errors.empDept}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <p htmlFor="empDesign" className="p_light2">
                        Designation
                      </p>
                      <select
                        id="empDesign"
                        value={values.empDesign}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="choose_designation need_width"
                        // onChange={(e) => setRole(e.target.value)}
                      >
                        <option>Choose Designation</option>;
                        {designation?.map((data) => {
                          return (
                            <option value={data._id}>{data.designation}</option>
                          );
                        })}
                      </select>
                      {errors.empDesign && touched.empDesign ? (
                        <p className="error_mess_addemp">{errors.empDesign}</p>
                      ) : null}
                      <button
                        // onClick={addingEmployee}

                        type="submit"
                        className="editemp_save_btn mt-3"
                      >
                        Add Employee
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* add emp pop up  */}
        </div>
        {btnLoader === false ? (
          <table className="table tablebordered">
            <thead>
              <tr>
                <th style={{ paddingLeft: "35px" }}>Sl No</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Team</th>
                <th style={{ width: "15%" }}>Designation</th>
              </tr>
            </thead>
            <tbody>
              {dataSource
                ? dataSource.map((each_emp, index) => {
                    return (
                      <tr
                        key={each_emp.id}
                        data-bs-toggle="modal"
                        data-bs-target="#display_emp_details"
                        onClick={() => getIndEmp(each_emp._id)}
                      >
                        <td style={{ paddingLeft: "35px" }}>{index + 1}</td>
                        <td>{each_emp.name === "" ? "-" : each_emp.name}</td>
                        <td className="emp_id">
                          {each_emp.emp_id === "" ? "-" : each_emp.emp_id}
                        </td>
                        <td>
                          {each_emp.department === ""
                            ? "-"
                            : each_emp.department}
                        </td>
                        <td>
                          {each_emp.designation === ""
                            ? "-"
                            : each_emp.designation}
                        </td>
                      </tr>
                    );
                  })
                : empDetails.map((each_emp, index) => {
                    return (
                      <tr
                        key={each_emp.id}
                        data-bs-toggle="modal"
                        data-bs-target="#display_emp_details"
                        onClick={() => getIndEmp(each_emp._id)}
                      >
                        <td style={{ paddingLeft: "35px" }}>{index + 1}</td>
                        <td>{each_emp.name === "" ? "-" : each_emp.name}</td>
                        <td className="emp_id">
                          {each_emp.emp_id === "" ? "-" : each_emp.emp_id}
                        </td>
                        <td>
                          {each_emp.department === ""
                            ? "-"
                            : each_emp.department}
                        </td>
                        <td>
                          {each_emp.designation === ""
                            ? "-"
                            : each_emp.designation}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        ) : (
          // <Table
          //   columns={columns}
          //   dataSource={dataSource}
          //   onRow={(record, rowIndex) => {
          //     return {
          //       onClick: () => {
          //         getIndEmp(columns.record._id);
          //       },
          //     };
          //   }}
          // // onClick={() => getIndEmp(columns.each_emp._id)}
          // pagination={{
          //   pageSize: 10,

          //   total: 300,
          //   onChange: (page) => {
          //     getAllEmployee(page);
          //   },
          //   }}
          // ></Table>
          // <table className="table tablebordered">
          //   <thead>
          //     <tr>
          //       <th style={{ paddingLeft: "35px" }}>Sl No</th>
          //       <th>Employee Name</th>
          //       <th>Employee ID</th>
          //       <th>Team</th>
          //       <th style={{ width: "15%" }}>Designation</th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {filteredEmpDetails.map((each_emp, index) => {
          //       return (
          //         <tr
          //           key={each_emp.id}
          //           data-bs-toggle="modal"
          //           data-bs-target="#display_emp_details"
          //           onClick={() => getIndEmp(each_emp._id)}
          //         >
          //           <td style={{ paddingLeft: "35px" }}>{index + 1}</td>
          //           <td>{each_emp.name === "" ? "-" : each_emp.name}</td>
          //           <td className="emp_id">
          //             {each_emp.emp_id === "" ? "-" : each_emp.emp_id}
          //           </td>
          //           <td>
          //             {each_emp.department === "" ? "-" : each_emp.department}
          //           </td>
          //           <td>
          //             {each_emp.designation === "" ? "-" : each_emp.designation}
          //           </td>
          //         </tr>
          //       );
          //     })}
          //   </tbody>
          // </table>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              height: "50vh",
            }}
          >
            <Loading />
          </div>
        )}

        {/* emp display details in ui pop up  */}
        <div
          className="modal fade display_emp"
          id="display_emp_details"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Employee Details</h1>

                <CloseIcon />
              </div>
              <div className="modal-body">
                <div className="container">
                  <div className="row">
                    <div className="col left_side">
                      <div>
                        <p className="p_light_d">Employee Name</p>
                        <p className="p_light_c">{individualEmp?.name}</p>
                        <p className="p_light_d">User ID</p>
                        <p className="p_light_c">{individualEmp?.email}</p>
                        <p className="p_light_d">Mobile Number</p>
                        <p className="p_light_c">{individualEmp?.mobile}</p>
                        <p className="p_light_d">Designation</p>
                        <p className="p_light_c">
                          {individualEmp?.designation}
                        </p>
                      </div>
                    </div>
                    <div className="col right_side">
                      <div>
                        <p className="p_light_d">Employee ID</p>
                        <p className="p_light_c">{individualEmp?.emp_id}</p>
                        <p className="p_light_d">Password</p>
                        <p className="p_light_c">{individualEmp?.password}</p>

                        <p className="p_light_d">Team</p>
                        <p className="p_light_c">{individualEmp?.department}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="del_btn "
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#delemp"
                  data-bs-dismiss="modal"
                >
                  <svg
                    style={{ marginRight: 10 }}
                    className="mr-1"
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5247 2.49523C11.7841 2.49523 12 2.71056 12 2.98456V3.23789C12 3.50522 11.7841 3.72722 11.5247 3.72722H0.475902C0.215907 3.72722 0 3.50522 0 3.23789V2.98456C0 2.71056 0.215907 2.49523 0.475902 2.49523H2.41971C2.81457 2.49523 3.1582 2.21457 3.24703 1.81857L3.34882 1.36391C3.50702 0.744581 4.02766 0.333252 4.62351 0.333252H7.37649C7.96585 0.333252 8.49233 0.744581 8.64469 1.33124L8.75362 1.8179C8.8418 2.21457 9.18543 2.49523 9.58094 2.49523H11.5247ZM10.5372 11.7559C10.7402 9.86462 11.0955 5.37133 11.0955 5.326C11.1084 5.18867 11.0637 5.05867 10.9749 4.95401C10.8796 4.85601 10.759 4.79801 10.626 4.79801H1.37901C1.24545 4.79801 1.11837 4.85601 1.03019 4.95401C0.940717 5.05867 0.896628 5.18867 0.903112 5.326C0.904303 5.33433 0.917053 5.49261 0.938368 5.75722C1.03306 6.93272 1.29678 10.2067 1.46719 11.7559C1.58779 12.8973 2.33665 13.6146 3.42137 13.6406C4.25842 13.6599 5.12075 13.6666 6.00253 13.6666C6.83309 13.6666 7.67662 13.6599 8.53959 13.6406C9.66192 13.6213 10.4101 12.9166 10.5372 11.7559Z"
                      fill="#EC5050"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  className="edit_btn"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#editemp"
                  data-bs-dismiss="modal"
                >
                  <svg
                    style={{ marginRight: 10 }}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.25093 11.3519L10.1085 3.77696C10.4269 3.36847 10.5401 2.8962 10.4339 2.41533C10.342 1.97817 10.0731 1.56251 9.66991 1.24719L8.68657 0.466042C7.83057 -0.214774 6.76941 -0.143109 6.16102 0.638038L5.5031 1.49157C5.41821 1.59835 5.43943 1.75601 5.54554 1.84201C5.54554 1.84201 7.20802 3.17497 7.2434 3.20364C7.35659 3.31114 7.44148 3.45447 7.4627 3.62646C7.49807 3.96329 7.26462 4.27861 6.91797 4.32161C6.75526 4.34311 6.59963 4.29295 6.48644 4.19978L4.73906 2.80948C4.65417 2.7457 4.52683 2.75932 4.45609 2.84532L0.303426 8.22018C0.034599 8.55701 -0.057368 8.99416 0.034599 9.41698L0.565178 11.7174C0.593475 11.8393 0.699591 11.9253 0.82693 11.9253L3.16148 11.8966C3.58594 11.8894 3.98211 11.6959 4.25093 11.3519ZM7.51979 10.6355H11.3265C11.6979 10.6355 12 10.9415 12 11.3178C12 11.6947 11.6979 12 11.3265 12H7.51979C7.14839 12 6.84631 11.6947 6.84631 11.3178C6.84631 10.9415 7.14839 10.6355 7.51979 10.6355Z"
                      fill="#0A0A0A"
                    />
                  </svg>
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* emp display details in ui pop up  ends here*/}
        {/* editemp  pop up  start*/}
        <div
          className="modal fade change_emp"
          id="editemp"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Details</h2>
                <CloseIcon />
              </div>
              <div className="modal-body">
                <div className="edit_inputs">
                  <div className="edit_inputs_left">
                    <label htmlFor="Full_name" className="p_light">
                      Employee Name
                    </label>
                    <input
                      className="input_feild"
                      defaultValue={individualEmp?.name}
                      type="text"
                      id="full_name"
                      placeholder="Enter Full Name"
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <label className="p_light">User ID</label>
                    <input
                      className="input_feild"
                      defaultValue={individualEmp?.emp_id}
                      type="email"
                      placeholder="eg. user@cendrol.com"
                      onChange={(e) => setNewUserId(e.target.value)}
                    />
                    <label className="p_light">Mobile Number</label>
                    <div className="d-flex">
                      <div className="numer_91">+91</div>
                      <input
                        className="input_feild_number"
                        defaultValue={individualEmp?.mobile}
                        type="number"
                        placeholder="eg.8256XXXX64"
                        onChange={(e) => setNewMob(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="edit_inputs_right">
                    {" "}
                    <label htmlFor="Full_name" className="p_light">
                      Employee ID
                    </label>
                    <input
                      className="input_feild"
                      defaultValue={individualEmp?.email}
                      type="text"
                      id="full_name"
                      placeholder="CEN070"
                      onChange={(e) => setNewEmpId(e.target.value)}
                    />
                    <label className="p_light">Password</label>
                    <input
                      className="input_feild"
                      defaultValue={individualEmp?.password}
                      type="text"
                      placeholder="eg. XXXXXX"
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                    <label className="p_light">Team</label>
                    <select
                      id="sel1"
                      defaultValue={individualEmp?.department}
                      onChange={(e) => setNewTeam(e.target.value)}
                    >
                      {department?.map((data) => {
                        return (
                          <option value={data._id}>{data.department}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <p className="p_light2">Designation</p>
                <select
                  className="choose_designation"
                  defaultValue={individualEmp?.designation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                >
                  {designation?.map((data) => {
                    return <option value={data._id}>{data.designation}</option>;
                  })}
                </select>
                <button
                  onClick={saveNewEmp}
                  data-bs-dismiss="modal"
                  type="button"
                  className="editemp_save_btn mt-3"
                >
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* edit emp pop up end  */}
        {/* delete emp detail pop up  */}
        <div
          className="modal fade change_emp"
          id="delemp"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header d-flex justify-content-center align-items-center"
                style={{
                  marginTop: 31,
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.833496 29.998C0.833496 13.9009 13.9002 0.831299 30.0002 0.831299C46.1293 0.831299 59.1668 13.9009 59.1668 29.998C59.1668 46.1009 46.1293 59.1646 30.0002 59.1646C13.9002 59.1646 0.833496 46.1009 0.833496 29.998ZM27.4335 18.9438C27.4335 17.5467 28.6002 16.3771 30.0002 16.3771C31.4002 16.3771 32.5377 17.5467 32.5377 18.9438V31.8355C32.5377 33.2384 31.4002 34.373 30.0002 34.373C28.6002 34.373 27.4335 33.2384 27.4335 31.8355V18.9438ZM30.0293 43.6509C28.6002 43.6509 27.4627 42.4842 27.4627 41.0842C27.4627 39.6842 28.6002 38.5467 30.0002 38.5467C31.4293 38.5467 32.5668 39.6842 32.5668 41.0842C32.5668 42.4842 31.4293 43.6509 30.0293 43.6509Z"
                    fill="#ED5454"
                  />
                </svg>
              </div>
              <div className=" d-flex justify-content-center align-items-center modal-body">
                Are you sure want to delete?
              </div>
              <div
                className="d-flex justify-content-evenly align-items-center"
                style={{
                  padding: 20,
                  paddingBottom: 26,
                }}
              >
                <button
                  onClick={deleteemp}
                  data-bs-dismiss="modal"
                  className="e_del"
                  type="button"
                >
                  Delete
                </button>
                <button
                  data-bs-dismiss="modal"
                  className="e_back"
                  type="button"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* delete emp detail pop up  */}
      </div>
      <div className="d-flex justify-content-end">
        <Pagination
          onChange={(page) => {
            getAllEmployee(page);
            setBtnLoader(true);
          }}
          // pageSize={PerPage}

          total={30}
          showTotal={(total, range) => (
            <p>{`Showing ${range[0]} to ${range[1]} of ${total} Results`}</p>
          )}
          // current={parseInt()}
          // // defaultCurrent={Page}
          // // showSizeChanger={false}
          // pageSizeOptions={[10, 20, 50, 100]}
          // showSizeChanger
          // // showQuickJumper
        />
      </div>
    </div>
  );
};

export default Employees;

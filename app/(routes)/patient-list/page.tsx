"use client";

import { onNavigate } from "@/actions/navigation";
import {
  fetchPatientList,
  searchPatientList,
} from "@/app/api/patients-api/patientList.api";
import DropdownMenu from "@/components/dropdown-menu";
import Edit from "@/components/shared/buttons/view";

import { Modal } from "@/components/shared/modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientPage({ patient }: { patient: any }) {
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortBy, setSortBy] = useState("firstName");
  const [patientList, setPatientList] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPatient, setTotalPatient] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if(option=='Age'){
      setSortBy("age");
    } else if (option=="Name"){
      setSortBy('firstName')
    } else if (option=="Gender"){
      setSortBy('gender')
    }
    console.log(sortBy,'ooption')
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Name", onClick: handleSortOptionClick },
    { label: "Age", onClick: handleSortOptionClick },
    { label: "Gender", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle going to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumberInt = parseInt(pageNumber, 10);

    // Check if pageNumber is a valid number and greater than 0
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt <= totalPages &&
      pageNumberInt > 0
    ) {
      setCurrentPage(pageNumberInt);

      console.log("Navigate to page:", pageNumberInt);
    } else {
      setGotoError(true);
      setTimeout(() => {
        setGotoError(false);
      }, 3000);
      console.error("Invalid page number:", pageNumber);
    }
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`flex border border-px items-center justify-center  w-[49px]  ${
            currentPage === i ? "btn-pagination" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchPatientList(
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );
        if (response.data.length === 0) {
          setPatientList([]);

          setIsLoading(false);
          return;
        }

        setPatientList(response.data);
        setTotalPages(response.totalPages);
        setTotalPatient(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [term, sortOrder, currentPage, sortBy, isOpen]);

  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();
    setIsLoading(true)
    onNavigate(
      router,
      `/patient-overview/${lowercasePatientId}/medical-history/allergies`
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  if (error) {
    onNavigate(router, "/login");
  }
  console.log("patientList", patientList);

  return (
    <div className="relative w-full mx-24 mt-24">
      <div className="flex justify-end">
        <p
          onClick={() => onNavigate(router, "/dashboard")}
          className="text-[#64748B] underline"
        >
          Back to Dashboard
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col mb-5 px-5 ">
          <p className="p-title ">Patients List Records</p>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[21px] mt-2 ">
            Total of {totalPatient} Patients
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <button
            className=" mr-2 btn-add h-12"
            onClick={() => isModalOpen(true)}
          >
            <img
              src="/imgs/add.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2"
            />
            Add
          </button>
          <button className="btn-pdfs relative h-12">
            <img
              src="/imgs/downloadpdf.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2 "
            />
            Download PDF
          </button>
        </div>
      </div>

      <div className="w-full shadow-md sm:rounded-lg items-center">
        <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px]">
          <form className=" mr-5">
            {/* search bar */}
            <label className=""></label>
            <div className="flex">
              <input
                className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[14px]  ring-[1px] ring-[#E7EAEE]"
                type="text"
                placeholder="Search by reference no. or name..."
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </form>
          <div className="flex w-full justify-end items-center gap-[12px] mr-3">
            <p className="text-[#191D23] opacity-[60% font-semibold]">Order by</p>
            <DropdownMenu
              options={optionsOrderedBy.map(({ label, onClick }) => ({
                label,
                onClick: () => {
                  onClick(label);
                },
              }))}
              open={isOpenOrderedBy}
              width={"165px"}
              label={"Select"}
            />
            <p className="text-[#191D23] opacity-[60%] font-semibold">Sort by</p>
            <DropdownMenu
              options={optionsSortBy.map(({ label, onClick }) => ({
                label,
                onClick: () => {
                  onClick(label);
                  console.log("label", label);
                },
              }))}
              open={isOpenSortedBy}
              width={"165px"}
              label={"Select"}
            />
          </div>
        </div>

        {/* START OF TABLE */}
        <div className="w-full h-full">
          {patientList.length === 0 ? (
            <div>
              <table className="w-full h-full justify-center items-start ">
                <thead className=" text-left rtl:text-right">
                  <tr className="uppercase text-[#64748B] border border-[#E7EAEE]">
                    <th scope="col" className="px-6 py-3 w-[286px] h-[70px]">
                      Patient ID
                    </th>
                    <th scope="col" className="px-6 py-3 w-[552px]">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 w-[277px]">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 w-[277px]">
                      Gender
                    </th>

                    <th scope="col" className="px-[70px] py-3 w-[210px] ">
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="w-full flex justify-center text-xl py-5">
                No Patient Found!
              </div>
            </div>
          ) : (
            <table className="w-full h-full justify-center items-start ">
              <thead className=" text-left rtl:text-right">
                <tr className="uppercase text-[#64748B] border border-[#E7EAEE]">
                  <th scope="col" className="px-6 py-3 w-[286px] h-[70px]">
                    Patient ID
                  </th>
                  <th scope="col" className="px-6 py-3 w-[552px]">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 w-[277px]">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 w-[277px]">
                    Gender
                  </th>

                  <th scope="col" className="px-[70px] py-3 w-[210px] ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody >
                {patientList.map((patient, index) => (
                  <tr
                    key={index}
                    className=" group  odd:bg-white hover:bg-gray-100 even:bg-gray-50 border-b"
                    
                  >
                    <th
                      scope="row"
                      className="truncate max-w-[286px] text-left px-6 py-5  font-medium text-gray-900 whitespace-nowrap"
                    >
                      {patient.uuid}
                    </th>
                    <td className="px-6">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-6">{patient.age}</td>
                    <td className="px-6">{patient.gender}</td>
                    <td className="px-[50px]"
                    >
                      <div onClick={() => handlePatientClick(patient.uuid)}><Edit></Edit></div>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      {totalPages <= 1 ? (
        <div></div>
      ) : (
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="font-medium size-[18px] w-[138px] items-center">
              Page {currentPage} of {totalPages}
            </p>
            <div>
              <nav>
                <div className="flex -space-x-px text-sm">
                  <div>
                    <button
                      onClick={goToPreviousPage}
                      className="flex border border-px items-center justify-center  w-[77px] h-full"
                    >
                      Prev
                    </button>
                  </div>
                  {renderPageNumbers()}

                  <div className="ml-5">
                    <button
                      onClick={goToNextPage}
                      className="flex border border-px items-center justify-center  w-[77px] h-full"
                    >
                      Next
                    </button>
                  </div>
                  <form onSubmit={handleGoToPage}>
                    <div className="flex px-5 ">
                      <input
                        className={`ipt-pagination appearance-none  text-center border ring-1 ${
                          gotoError ? "ring-red-500" : "ring-gray-300"
                        } border-gray-100`}
                        type="text"
                        placeholder="-"
                        pattern="\d*"
                        value={pageNumber}
                        onChange={handlePageNumberChange}
                        onKeyPress={(e) => {
                          // Allow only numeric characters (0-9), backspace, and arrow keys
                          if (
                            !/[0-9\b]/.test(e.key) &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <div className="px-5">
                        <button type="submit" className="btn-pagination ">
                          Go{" "}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <Modal isModalOpen={isModalOpen} isOpen={isOpen} label="sample label" />
      )}
    </div>
  );
}

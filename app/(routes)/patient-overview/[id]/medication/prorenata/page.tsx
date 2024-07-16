"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchPRNMedByPatient } from "@/app/api/medication-logs-api/prn-med-api";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Modal from "@/components/reusable/modal";
import { PrnModalContent } from "@/components/modal-content/prn-modal-content";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import { formatTableTime } from "@/lib/utils";
import { formatTableDate } from "@/lib/utils";

const Prorenata = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("medicationLogsDate");
  const [pageNumber, setPageNumber] = useState("");
  const [patientPRNMed, setPatientPRNMed] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPRNMeds, setTotalPRNMeds] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [PRNData, setPRNData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);


  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setPRNData([]);
    }
  };

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    setIsOpenOrderedBy(false);
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };
  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("medicationLogsDate");
    } else if (option === "Time") {
      setSortBy("medicationLogsTime");
    } else {
      setSortBy("medicationLogsName");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Medication", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPRNMedByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router,
        );
        setPatientPRNMed(response.data);
        setTotalPages(response.totalPages);
        console.log(response.totalPages, "total");
        setTotalPRNMeds(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };

  if (isLoading) {
    return (
      <div className="container flex h-full w-full items-center justify-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }

  console.log(patientPRNMed, "prn med");

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Medication Logs</p>
              <span className="slash">{">"}</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/medication/scheduled`,
                  );
                }}
                className="bread"
              >
                Scheduled
              </span>
              <span className="slash">{"/"}</span>
              <span className="active">PRN</span>
            </div>
            <div>
              <p className="h-[23px] my-1 text-[15px] font-normal text-[#64748B]">
                Total of {totalPRNMeds} PRN Medication Logs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={18} height={18} />
              <p className="">Add</p>
            </button>
            <button className="btn-pdfs gap-2">
              <Image
                src="/imgs/downloadpdf.svg"
                alt=""
                width={18}
                height={18}
              />
              <p className="">Generate PDF</p>
            </button>
          </div>
        </div>

        <div className="m:rounded-lg w-full items-center">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative mx-5 my-4 h-[47px] w-[460px] rounded-[3px] bg-[#fff] bg-[center] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none border-[1px] border-[#E7EAEE]  placeholder:text-[#64748B]"
                  type="text"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Image
                  src="/svgs/search.svg"
                  alt="Search"
                  width="20"
                  height="20"
                  className="pointer-events-none absolute left-8 top-8"
                />
              </div>
            </form>

            <div className="mr-3 flex w-full items-center justify-end gap-[12px]">
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Order by
              </p>
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
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Sort by
              </p>
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
          <div>
            <table className="text-left rtl:text-right">
              <thead>
                <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                  <td className="px-6 py-3">Medication UID</td>
                  <td className="px-6 py-3">Date</td>
                  <td className="px-6 py-3">Time</td>
                  <td className="px-6 py-3">Medication</td>
                  <td className="px-6 py-3">Dosage</td>
                  <td className="px-6 py-3">Notes</td>
                  <td className="px-6 py-3">Status</td>
                  {/* <td className="px-6 py-3 "><p className="ml-[38px] w-[109px]">Action</p></td>    */}
                  <td className="px-6 py-3 relative"><p className="absolute top-[23px] right-[80px]">Action</p></td>  
                </tr>
              </thead>
              <tbody className="h-[254px] ">
                {patientPRNMed.length === 0 && (
                  <tr>
                    <td className="border-1 absolute flex items-center justify-center py-5">
                      <p className="text-center text-[15px] font-normal text-gray-700">
                        No PRN Medication Log/s <br />
                      </p>
                    </td>
                  </tr>
                )}
                {patientPRNMed.map((prnMed, index) => (
                  <>
                    <tr
                      key={index}
                      className="group  h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                    >
                      <td className="px-6 py-3">
                        <ResuableTooltip text={prnMed.medicationlogs_uuid} />
                      </td>
                      <td className="px-6 py-3">
                        {formatTableDate(
                          prnMed.medicationlogs_medicationLogsDate,
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {formatTableTime(
                          prnMed.medicationlogs_medicationLogsTime,
                        )}
                        {/* time not formattd left as is for now  and check with local time of machine */}
                      </td>
                      <td className="px-6 py-3">
                        <ResuableTooltip
                          text={prnMed.medicationlogs_medicationLogsName}
                        />
                      </td>
                      <td className="px-6 py-3">
                        500mg
                        {/* static value for dosage temporary */}
                      </td>

                      <td className="px-6 py-3">
                        <ResuableTooltip text={prnMed.medicationlogs_notes} />
                      </td>
                      <td className="text-15px flex items-center rounded-full px-6 py-5">
                        <div
                          className={`relative flex h-[25px] w-[85px] items-center justify-center rounded-[30px] font-semibold ${
                            prnMed.medicationlogs_medicationLogStatus ===
                            "Given"
                              ? "bg-[#CCFFDD] text-[15px] text-[#17C653]" // Green color for Given
                              : prnMed.medicationlogs_medicationLogStatus ===
                                  "Held"
                                ? "h-[25px] bg-[#FFF8DD] px-7 text-center text-[15px] text-[#F6C000]" // Dark color for Held
                                : prnMed.medicationlogs_medicationLogStatus ===
                                    "Refused"
                                  ? "h-[25px] w-[85px] bg-[#FFE8EC] text-[15px] text-[#DB3956]" // Red color for Refused
                                  : prnMed.medicationlogs_medicationLogStatus
                          }`}
                        >
                          {prnMed.medicationlogs_medicationLogStatus}
                        </div>
                      </td>

                      <td className="pl-6 py-3 relative ">
                        <p
                          onClick={() => {
                            isModalOpen(true);
                            setIsEdit(true);
                            setPRNData(prnMed);
                          }}
                          className="absolute top-[11px] right-[40px]"
                        >
                          <Edit></Edit>
                        </p>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {/* END OF TABLE */}
        </div>
      </div>
      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setCurrentPage={setCurrentPage}
      />
      {isOpen && (
        <Modal
          content={
            <PrnModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              uuid={""}
              name=""
              isEdit={isEdit}
              setIsUpdated={setIsUpdated}
              PRNData={PRNData}
              label="sample label"
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setError}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="PRN Log already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Prorenata;

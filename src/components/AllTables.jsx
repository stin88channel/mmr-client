import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// BANKS LOGOS
import sberLogo from "../assets/banks/sber.png";
import tinkoffLogo from "../assets/banks/tinkoff.png";
import alfaLogo from "../assets/banks/alfabank.png";
import otpLogo from "../assets/banks/OTPBank.png";
import rshbLogo from "../assets/banks/rshb.png";
import solidarnostLogo from "../assets/banks/solidarnost.png";

const ROWS_PER_PAGE = 9;

const AllTables = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [allApplications, setAllApplications] = useState([]);
  const [error, setError] = useState(null);

  const getInitialTableState = (tableName, defaultValue) => {
    const path = location.pathname;
    const currentTable = path.split("/").pop();

    if (currentTable === tableName) {
      return true;
    }

    const storedValue = localStorage.getItem(tableName);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Состояния для таблиц
  const [activeTable, setActiveTable] = useState(false);
  const [processingTable, setProcessingTable] = useState(false);
  const [closedTable, setClosedTable] = useState(false);
  const [canceledTable, setCanceledTable] = useState(false);
  const [allTable, setAllTable] = useState(false);

  // Первый useEffect для обработки навигации и начальной загрузки
  useEffect(() => {
    const handlePopState = (event) => {
      const tableName = event.state?.table || "active";
      setActiveTable(tableName === "active");
      setProcessingTable(tableName === "processing");
      setClosedTable(tableName === "closed");
      setCanceledTable(tableName === "canceled");
      setAllTable(tableName === "all");
    };

    window.addEventListener("popstate", handlePopState);

    const currentPath = window.location.pathname;
    const currentTable = currentPath.split("/").pop();

    if (
      ["active", "processing", "closed", "canceled", "all"].includes(
        currentTable
      )
    ) {
      handlePopState({ state: { table: currentTable } });
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Второй useEffect для сохранения состояний в localStorage
  useEffect(() => {
    localStorage.setItem("activeTable", JSON.stringify(activeTable));
    localStorage.setItem("processingTable", JSON.stringify(processingTable));
    localStorage.setItem("closedTable", JSON.stringify(closedTable));
    localStorage.setItem("canceledTable", JSON.stringify(canceledTable));
    localStorage.setItem("allTable", JSON.stringify(allTable));
  }, [activeTable, processingTable, closedTable, canceledTable, allTable]);

  // Обработчики для кнопок
  const handleActiveTableClick = () => {
    setActiveTable(true);
    setProcessingTable(false);
    setClosedTable(false);
    setCanceledTable(false);
    setAllTable(false);
    navigate("/requests/active");
    fetchApplications("active");
  };

  const handleProcessingTableClick = () => {
    setActiveTable(false);
    setProcessingTable(true);
    setClosedTable(false);
    setCanceledTable(false);
    setAllTable(false);
    navigate("/requests/processing");
    fetchApplications("processing");
  };

  const handleClosedTableClick = () => {
    setActiveTable(false);
    setProcessingTable(false);
    setClosedTable(true);
    setCanceledTable(false);
    setAllTable(false);
    navigate("/requests/closed");
    fetchApplications("closed");
  };

  const handleCanceledTableClick = () => {
    setActiveTable(false);
    setProcessingTable(false);
    setClosedTable(false);
    setCanceledTable(true);
    setAllTable(false);
    navigate("/requests/canceled");
    fetchApplications("canceled");
  };

  const handleAllTableClick = () => {
    setActiveTable(false);
    setProcessingTable(false);
    setClosedTable(false);
    setCanceledTable(false);
    setAllTable(true);
    navigate("/requests/all");
    fetchApplications("all");
  };

  // Состояния для данных
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция загрузки данных
  const fetchApplications = async (type) => {
    setLoading(true);
    try {
      // Получаем userId из контекста пользователя
      const userId = user._id; // Предполагается, что user доступен в контексте

      const response = await axios.get(`/api/applications?type=${type}`, {
        params: { userId }, // Передаем userId в качестве параметра запроса
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  // При монтировании компонента проверяем URL
  useEffect(() => {
    const path = location.pathname;
    const currentTable = path.split("/").pop();

    // Сбрасываем все состояния
    setActiveTable(false);
    setProcessingTable(false);
    setClosedTable(false);
    setCanceledTable(false);
    setAllTable(false);

    // Устанавливаем состояние в зависимости от URL и загружаем данные
    switch (currentTable) {
      case "active":
        setActiveTable(true);
        fetchApplications("active");
        break;
      case "processing":
        setProcessingTable(true);
        fetchApplications("processing");
        break;
      case "closed":
        setClosedTable(true);
        fetchApplications("closed");
        break;
      case "canceled":
        setCanceledTable(true);
        fetchApplications("canceled");
        break;
      default:
        setAllTable(true);
        fetchApplications("all");
    }
  }, [location.pathname]);

  const [processingTableData, setProcessingTableData] = useState([
    { id: 1, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 2, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 3, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 4, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 5, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 6, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 7, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 8, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 9, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 10, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 11, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 12, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 13, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 14, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 15, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 16, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 17, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 18, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 19, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 20, sum: "1488", status: "Проверка", course: "$15.46" },
    { id: 21, sum: "1488", status: "Проверка", course: "$15.46" },
  ]);

  const [activeTableData, setActiveTableData] = useState([]); // Данные для активных заявок
  const [closedTableData, setClosedTableData] = useState([]); // Данные для проверяемых заявок
  const [canceledTableData, setCanceledTableData] = useState([]); // Данные для закрытых заявок
  const [allTableData, setAllTableData] = useState([]); // Данные для отмененных заявок

  const [currentPageActive, setCurrentPageActive] = useState(1);
  const [currentPageProcessing, setCurrentPageProcessing] = useState(1);
  const [currentPageClosed, setCurrentPageClosed] = useState(1);
  const [currentPageCanceled, setCurrentPageCanceled] = useState(1);

  const [currentPageAll, setCurrentPageAll] = useState(1);

  // Функция для генерации пустых строк
  const generateEmptyRows = (currentRows) => {
    const emptyRows = [];
    for (let i = currentRows.length; i < ROWS_PER_PAGE; i++) {
      emptyRows.push({ id: `empty-${i}`, isEmpty: true });
    }
    return emptyRows;
  };

  // Отдельные обработчики для каждой таблицы
  const handlePageChangeActive = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(activeTableData.length / ROWS_PER_PAGE)
    ) {
      setCurrentPageActive(newPage);
    }
  };

  const handlePageChangeProcessing = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(processingTableData.length / ROWS_PER_PAGE)
    ) {
      setCurrentPageProcessing(newPage);
    }
  };

  const handlePageChangeClosed = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(closedTableData.length / ROWS_PER_PAGE)
    ) {
      setCurrentPageClosed(newPage);
    }
  };

  const handlePageChangeCanceled = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(canceledTableData.length / ROWS_PER_PAGE)
    ) {
      setCurrentPageCanceled(newPage);
    }
  };

  // Обработчик изменения страницы
  const handlePageChangeAll = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPageAll(newPage);
    }
  };

  const handleMoveToTable2 = (rowId) => {
    const row = processingTableData.find((row) => row.id === rowId);
    const updatedRow = { ...row, status: "Отменено", className: "canceled" };
    setCanceledTableData([...canceledTableData, updatedRow]);
    setAllTableData([...allTableData, updatedRow]);
    setProcessingTableData(
      processingTableData.filter((row) => row.id !== rowId)
    );
  };

  const handleMoveToTable3 = (rowId) => {
    const row = processingTableData.find((row) => row.id === rowId);
    const updatedRow = { ...row, status: "Закрыто", className: "closed" };
    setClosedTableData([...closedTableData, updatedRow]);
    setAllTableData([...allTableData, updatedRow]);
    setProcessingTableData(
      processingTableData.filter((row) => row.id !== rowId)
    );
  };

  useEffect(() => {
    const fetchActiveApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/applications?type=active", {
          withCredentials: true,
        });
        console.log("Полученные активные заявки:", response.data); // Логируем данные
        setActiveTableData(response.data); // Устанавливаем данные для активных заявок
      } catch (error) {
        console.error("Ошибка при получении активных заявок:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Не удалось загрузить активные заявки";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false); // Сбрасываем состояние загрузки
      }
    };

    // Функция для загрузки закрытых заявок
    const fetchClosedApplications = async () => {
      setLoading(true); // Устанавливаем состояние загрузки
      try {
        const response = await axios.get("/api/applications?type=closed", {
          withCredentials: true,
        });
        console.log("Полученные закрытые заявки:", response.data); // Логируем данные
        setClosedTableData(response.data); // Устанавливаем данные для закрытых заявок
      } catch (error) {
        console.error("Ошибка при получении закрытых заявок:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Не удалось загрузить закрытые заявки";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false); // Сбрасываем состояние загрузки
      }
    };

    const fetchAllApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/applications?type=all", {
          withCredentials: true,
        });
        console.log("Полученные все заявки:", response.data); // Логируем данные
        setAllApplications(response.data); // Устанавливаем данные для всех заявок
      } catch (error) {
        console.error("Ошибка при получении всех заявок:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Не удалось загрузить все заявки";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false); // Сбрасываем состояние загрузки
      }
    };

    fetchActiveApplications();
    fetchClosedApplications();
    fetchAllApplications(); // Загружаем закрытые заявки при монтировании компонента
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "active";
      case "closed":
        return "closed";
      case "canceled":
        return "canceled";
      case "processing":
        return "processing";
      default:
        return "";
    }
  };

  const getBankLogo = (bankName) => {
    const bankLogos = {
      СБЕР: sberLogo,
      ТИНЬКОФФ: tinkoffLogo,
      АЛЬФА: alfaLogo,
      ОТП: otpLogo,
      РСХБ: rshbLogo,
      СОЛИДАРНОСТЬ: solidarnostLogo,
    };

    return bankLogos[bankName] || "";
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Активный";
      case "completed":
        return "Закрыто";
      case "canceled":
        return "Отменено";
      default:
        return status; // Возвращаем статус по умолчанию, если он не распознан
    }
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(allApplications.length / ROWS_PER_PAGE);

  // Получаем заявки для текущей страницы
  const startIndex = (currentPageAll - 1) * ROWS_PER_PAGE;
  const currentApplications = allApplications.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  return (
    <>
      <div className="tables">
        <div className="applications_buttons">
          <div className="applications_options">
            <button
              className={`buttons ${activeTable ? "button_active" : ""}`}
              onClick={handleActiveTableClick}
            >
              Активные
            </button>
            <button
              className={`buttons ${processingTable ? "button_active" : ""}`}
              onClick={handleProcessingTableClick}
            >
              Проверки
            </button>
            <button
              className={`buttons ${closedTable ? "button_active" : ""}`}
              onClick={handleClosedTableClick}
            >
              Закрытые
            </button>
            <button
              className={`buttons ${canceledTable ? "button_active" : ""}`}
              onClick={handleCanceledTableClick}
            >
              Отменено
            </button>
            <button
              className={`buttons ${allTable ? "button_active" : ""}`}
              onClick={handleAllTableClick}
            >
              Все заявки
            </button>
          </div>
        </div>

        {activeTable && (
          <div className={`applications_table ${activeTable ? "" : "hidden"}`}>
            <table>
              <thead>
                <tr>
                  <th>ID заявки</th>
                  <th>Сумма</th>
                  <th>Реквизиты</th>
                  <th>Статус</th>
                  <th>Курс Сумма</th>
                </tr>
              </thead>
              <tbody>
                {activeTableData.length > 0 ? (
                  activeTableData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td> {/* Отображаем ID заявки */}
                      <td>{row.sum}</td> {/* Отображаем сумму */}
                      <td>
                        <div className="bank-requisites">
                          <img
                            src={getBankLogo(row.bank)}
                            alt={`${row.bank} logo`}
                            className="bank-logo"
                          />
                          <span>{row.botRequisites}</span>{" "}
                          {/* Отображаем реквизиты */}
                        </div>
                      </td>
                      <td className={getStatusClass(row.status)}>
                        {row.status === "active" ? "Активный" : "Закрыто"}
                      </td>{" "}
                      {/* Отображаем статус с соответствующим классом */}
                      <td>{row.course}</td> {/* Отображаем курс суммы */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Нет активных заявок
                    </td>
                  </tr>
                )}
                {/* Добавляем пустые строки */}
                {activeTableData.length < 9 &&
                  Array.from({ length: 8 - activeTableData.length }).map(
                    (_, index) => (
                      <tr key={`empty-${index}`} className="empty-row">
                        <td colSpan="5" style={{ height: "45px" }}></td>{" "}
                        {/* Пустая строка */}
                      </tr>
                    )
                  )}
              </tbody>
            </table>
            <div className="pagination">
              <p>
                {currentPageActive} /{" "}
                {Math.max(1, Math.ceil(activeTableData.length / ROWS_PER_PAGE))}
              </p>
              <div>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeActive(currentPageActive - 1)}
                  disabled={currentPageActive === 1}
                >
                  ←
                </button>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeActive(currentPageActive + 1)}
                  disabled={
                    currentPageActive ===
                    Math.max(
                      1,
                      Math.ceil(activeTableData.length / ROWS_PER_PAGE)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {processingTable && (
          <div
            className={`applications_table ${processingTable ? "" : "hidden"}`}
          >
            <table>
              <thead>
                <tr>
                  <th>ID заявки</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Курс Сумма</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...processingTableData.slice(
                    (currentPageProcessing - 1) * ROWS_PER_PAGE,
                    currentPageProcessing * ROWS_PER_PAGE
                  ),
                  ...generateEmptyRows(
                    processingTableData.slice(
                      (currentPageProcessing - 1) * ROWS_PER_PAGE,
                      currentPageProcessing * ROWS_PER_PAGE
                    )
                  ),
                ].map((row) => (
                  <tr key={row.id} className={row.isEmpty ? "empty-row" : ""}>
                    <td>{row.isEmpty ? "" : row.id}</td>
                    <td>{row.isEmpty ? "" : row.sum}</td>
                    <td
                      className={row.isEmpty ? "" : getStatusClass(row.status)}
                    >
                      {row.isEmpty ? "" : row.status}
                    </td>
                    <td>{row.isEmpty ? "" : row.course}</td>
                    <td>
                      {!row.isEmpty && (
                        <>
                          <button
                            className="checking_button confirm"
                            onClick={() => handleMoveToTable3(row.id)}
                          >
                            ✔️
                          </button>
                          <button
                            className="checking_button cancel"
                            onClick={() => handleMoveToTable2(row.id)}
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <p>
                {currentPageProcessing} /{" "}
                {Math.max(
                  1,
                  Math.ceil(processingTableData.length / ROWS_PER_PAGE)
                )}
              </p>
              <div>
                <button
                  className="pagination_button"
                  onClick={() =>
                    handlePageChangeProcessing(currentPageProcessing - 1)
                  }
                  disabled={currentPageProcessing === 1}
                >
                  ←
                </button>
                <button
                  className="pagination_button"
                  onClick={() =>
                    handlePageChangeProcessing(currentPageProcessing + 1)
                  }
                  disabled={
                    currentPageProcessing ===
                    Math.max(
                      1,
                      Math.ceil(processingTableData.length / ROWS_PER_PAGE)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {closedTable && (
          <div className={`applications_table ${closedTable ? "" : "hidden"}`}>
            <table>
              <thead>
                <tr>
                  <th>ID заявки</th>
                  <th>Сумма</th>
                  <th>Реквизиты</th>
                  <th>Статус</th>
                  <th>Курс Сумма</th>
                </tr>
              </thead>
              <tbody>
                {closedTableData.length > 0 ? (
                  closedTableData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.sum}</td>
                      <td>
                        <div className="bank-requisites">
                          <img
                            src={getBankLogo(row.bank)}
                            alt={`${row.bank} logo`}
                            className="bank-logo"
                          />
                          <span>{row.botRequisites}</span>
                        </div>
                      </td>
                      <td className={getStatusClass(row.status)}>
                        {row.status === "completed" ? "Закрыто" : row.status}
                      </td>
                      <td>{row.course}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Нет закрытых заявок
                    </td>
                  </tr>
                )}
                {closedTableData.length < 9 &&
                  Array.from({ length: 9 - closedTableData.length }).map(
                    (_, index) => (
                      <tr key={`empty-${index}`} className="empty-row">
                        <td colSpan="5" style={{ height: "45px" }}></td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
            <div className="pagination">
              <p>
                {currentPageClosed} /{" "}
                {Math.max(1, Math.ceil(closedTableData.length / ROWS_PER_PAGE))}
              </p>
              <div>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeClosed(currentPageClosed - 1)}
                  disabled={currentPageClosed === 1}
                >
                  ←
                </button>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeClosed(currentPageClosed + 1)}
                  disabled={
                    currentPageClosed ===
                    Math.max(
                      1,
                      Math.ceil(closedTableData.length / ROWS_PER_PAGE)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {canceledTable && (
          <div
            className={`applications_table ${canceledTable ? "" : "hidden"}`}
          >
            <table>
              <thead>
                <tr>
                  <th>ID заявки</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Курс Сумма</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...canceledTableData.slice(
                    (currentPageCanceled - 1) * ROWS_PER_PAGE,
                    currentPageCanceled * ROWS_PER_PAGE
                  ),
                  ...generateEmptyRows(
                    canceledTableData.slice(
                      (currentPageCanceled - 1) * ROWS_PER_PAGE,
                      currentPageCanceled * ROWS_PER_PAGE
                    )
                  ),
                ].map((row) => (
                  <tr key={row.id} className={row.isEmpty ? "empty-row" : ""}>
                    <td>{row.isEmpty ? "" : row.id}</td>
                    <td>{row.isEmpty ? "" : row.sum}</td>
                    <td
                      className={row.isEmpty ? "" : getStatusClass(row.status)}
                    >
                      {row.isEmpty ? "" : row.status}
                    </td>
                    <td>{row.isEmpty ? "" : row.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <p>
                {currentPageCanceled} /{" "}
                {Math.max(
                  1,
                  Math.ceil(canceledTableData.length / ROWS_PER_PAGE)
                )}
              </p>
              <div>
                <button
                  className="pagination_button"
                  onClick={() =>
                    handlePageChangeCanceled(currentPageCanceled - 1)
                  }
                  disabled={currentPageCanceled === 1}
                >
                  ←
                </button>
                <button
                  className="pagination_button"
                  onClick={() =>
                    handlePageChangeCanceled(currentPageCanceled + 1)
                  }
                  disabled={
                    currentPageCanceled ===
                    Math.max(
                      1,
                      Math.ceil(canceledTableData.length / ROWS_PER_PAGE)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {allTable && (
          <div className={`applications_table ${allTable ? "" : "hidden"}`}>
            <table>
              <thead>
                <tr>
                  <th>ID заявки</th>
                  <th>Сумма</th>
                  <th>Реквизиты</th>
                  <th>Статус</th>
                  <th>Курс Сумма</th>
                </tr>
              </thead>
              <tbody>
                {currentApplications.length > 0 ? (
                  currentApplications.map((row) => (
                    <tr key={row.id} className={getStatusClass(row.status)}>
                      <td>{row.id}</td> {/* Отображаем ID заявки */}
                      <td>{row.sum}</td> {/* Отображаем сумму */}
                      <td>
                        <div className="bank-requisites">
                          <img
                            src={getBankLogo(row.bank)}
                            alt={`${row.bank} logo`}
                            className="bank-logo"
                          />
                          <span>{row.botRequisites}</span>{" "}
                          {/* Отображаем реквизиты */}
                        </div>
                      </td>
                      <td>{getStatusText(row.status)}</td>{" "}
                      {/* Отображаем статус */}
                      <td>{row.course}</td> {/* Отображаем курс суммы */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Нет заявок
                    </td>
                  </tr>
                )}
                {/* Добавляем пустые строки для выравнивания таблицы */}
                {currentApplications.length < ROWS_PER_PAGE &&
                  Array.from({
                    length: ROWS_PER_PAGE - currentApplications.length,
                  }).map((_, index) => (
                    <tr key={`empty-${index}`} className="empty-row">
                      <td colSpan="5" style={{ height: "45px" }}></td>{" "}
                      {/* Пустая строка */}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagination">
              <p>
                {currentPageAll} / {totalPages}
              </p>
              <div>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeAll(currentPageAll - 1)}
                  disabled={currentPageAll === 1}
                >
                  ←
                </button>
                <button
                  className="pagination_button"
                  onClick={() => handlePageChangeAll(currentPageAll + 1)}
                  disabled={currentPageAll === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllTables;

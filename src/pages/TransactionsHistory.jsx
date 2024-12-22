import { useState, useEffect } from "react";
import axios from "axios";
import "./css/TransactionsHistory.css";
import Header from "../pages/Header";

const TransactionsHistory = ({ showHeader = true }) => {
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/v1/successful-deposits", {
          withCredentials: true,
        });
        setDeposits(response.data);
      } catch (error) {
        console.error("Ошибка при получении депозитов:", error);
        setError(
          error.response?.data?.error || "Ошибка при загрузке депозитов"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeposits();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchDeposits, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (error) {
    return <div className="deposits-error">{error}</div>;
  }

  return (
    <>
      {showHeader && <Header />}
      <div className="transactions">
        <div className="transactions-history-container">
          <div className="menu-buttons">
            <button
              className={`menu-button ${
                activeSection === "deposits" ? "active" : ""
              }`}
              onClick={() => toggleSection("deposits")}
            >
              Депозиты
            </button>
            <button
              className={`menu-button ${
                activeSection === "topups" ? "active" : ""
              }`}
              onClick={() => toggleSection("topups")}
            >
              Пополнения
            </button>
            <button
              className={`menu-button ${
                activeSection === "statistics" ? "active" : ""
              }`}
              onClick={() => toggleSection("statistics")}
            >
              Статистика
            </button>
          </div>

          <div className={`section-content ${activeSection ? "expanded" : ""}`}>
            {activeSection === "deposits" && (
              <div className="deposits-section">
                <h3>Депозиты</h3>
                {deposits.map((deposit) => (
                  <div key={deposit._id} className="deposit-item">
                    <span className="deposit-amount">
                      +{deposit.amount.toFixed(2)}₽
                    </span>
                    <div className="deposit-details">
                      <span className="deposit-date">
                        {new Date(deposit.timestamp).toLocaleDateString(
                          "ru-RU",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </span>
                      <span className="deposit-time">
                        {new Date(deposit.timestamp).toLocaleTimeString(
                          "ru-RU",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "topups" && (
              <div className="topups-section">
                <h3>Пополнения</h3>
                {/* Здесь будет информация о пополнениях */}
                <p>Информация о пополнениях пока недоступна.</p>
              </div>
            )}

            {activeSection === "statistics" && (
              <div className="statistics-section">
                <h3>Статистика</h3>
                {/* Здесь будет статистика */}
                <p>Статистика пока недоступна.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsHistory;

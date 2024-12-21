import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./css/PaymentPage.css";

// BANKS LOGOS
import sberLogo from "../assets/banks/sber.png";
import tinkoffLogo from "../assets/banks/tinkoff.png";
import alfaLogo from "../assets/banks/alfabank.png";
import otpLogo from "../assets/banks/OTPBank.png";
import rshbLogo from "../assets/banks/rshb.png";
import solidarnostLogo from "../assets/banks/solidarnost.png";

import mmr_logo from "../assets/mmr_logo.png";

const PaymentPage = () => {
  const location = useLocation();
  const withdrawAmount = location.state?.amount || ""; // Получаем сумму из state
  const navigate = useNavigate();
  const [paymentOption, setPaymentOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopiedRequisites, setIsCopiedRequisites] = useState(false);

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      setIsLoading(true); // Устанавливаем состояние загрузки
      try {
        // Сначала проверяем кэш
        const cachedData = localStorage.getItem("paymentOptions");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log("Используем кэшированные данные:", parsedData);
            setPaymentOption({
              ...parsedData[Math.floor(Math.random() * parsedData.length)],
              usedAmount: 0, // Инициализируем usedAmount
            });
            return; // Выходим из функции, если кэшированные данные валидны
          }
        }

        // Затем делаем запрос на сервер
        const response = await axios.get("/api/payment-options", {
          withCredentials: true,
        });

        console.log("Полученные данные платежных опций:", response.data);

        if (!response.data || response.data.length === 0) {
          throw new Error("Нет доступных платежных опций");
        }

        // Выбираем случайную платежную опцию
        const randomOption =
          response.data[Math.floor(Math.random() * response.data.length)];
        setPaymentOption({
          ...randomOption,
          usedAmount: 0, // Инициализируем usedAmount
        });

        // Кэшируем новые данные
        localStorage.setItem("paymentOptions", JSON.stringify(response.data));
      } catch (error) {
        console.error("Ошибка при получении платежных опций:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Не удалось загрузить данные платежа";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false); // Сбрасываем состояние загрузки
      }
    };

    fetchPaymentOptions();
  }, []);

  const handlePaymentConfirmation = async () => {
    setIsLoading(true);
    console.log("PaymentOption перед отправкой:", paymentOption);

    if (!paymentOption) {
      const errorMessage = "Платежная опция не определена";
      console.error(errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    const amountToWithdraw = parseFloat(withdrawAmount); // Конвертируем сумму в число

    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      const errorMessage = "Некорректная сумма платежа";
      console.error(errorMessage, { withdrawAmount });
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    console.log("Отправляемая сумма:", amountToWithdraw);

    try {
      if (!paymentOption._id) {
        throw new Error("ID платежной опции не найден");
      }

      const response = await axios.post(
        `/api/confirm-payment/${paymentOption._id}`,
        { amount: amountToWithdraw },
        { withCredentials: true }
      );

      console.log("Ответ сервера:", response.data);

      if (response.data.success) {
        toast.success("Платеж подтвержден");

        // Обновляем лимит платежной опции
        setPaymentOption((prevOption) => {
          const newLimit = Math.max(prevOption.limit - amountToWithdraw, 0.01);
          const newUsedAmount = (prevOption.usedAmount || 0) + amountToWithdraw;
          return {
            ...prevOption,
            limit: newLimit,
            usedAmount: newUsedAmount,
          };
        });

        navigate("/user/payments");
      } else {
        throw new Error(response.data.error || "Неизвестная ошибка");
      }
    } catch (error) {
      console.error("Ошибка при подтверждении платежа:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Не удалось подтвердить платеж";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRequisitesToClipboard = (requisites) => {
    navigator.clipboard
      .writeText(requisites)
      .then(() => {
        setIsCopiedRequisites(true); // Закрывающая фигурная скобка была добавлена здесь
        toast.success("Реквизиты скопированы");
        setTimeout(() => setIsCopiedRequisites(false), 2000); // Сброс состояния через 2 секунды
      })
      .catch((err) => {
        console.error("Ошибка при копировании реквизитов:", err);
        toast.error("Не удалось скопировать реквизиты");
      });
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

    return bankLogos[bankName] || ""; // Возвращаем логотип или пустую строку, если банк не найден
  };

  if (isLoading) {
    return (
      <div className="preload">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <img src={mmr_logo} className="auth_logo" />
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate("/")} className="back-button">
              Вернуться на главную
            </button>
            <Link to="/requests">Связаться с тех. поддержкой сайта</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <img src={mmr_logo} className="auth_logo" />
        <h2>Оплата {withdrawAmount}₽</h2>
        {paymentOption && (
          <>
            <div className="payment-details">
              <div className="bank-info">
                <p>
                  Убедительная просьба проверить реквизиты и сумму, перед перевода
                  денежных средств
                </p>
                <div className="payment-bank-requisites">
                  <img
                    src={getBankLogo(paymentOption.bank)}
                    alt={`${paymentOption.bank} logo`}
                    className="bank-logo"
                  />
                  <span>{paymentOption.bank}</span> {/* Отображаем реквизиты */}
                </div>
              </div>
              <div className="requisites-info">
                <h3>Реквизиты для оплаты:</h3>
                <div className="requisites-info-copy">
                  <p>{paymentOption.botRequisites}</p>
                  <button
                    className="copy_button"
                    onClick={() =>
                      copyRequisitesToClipboard(paymentOption.botRequisites)
                    }
                    title={
                      isCopiedRequisites ? "Скопировано!" : "Копировать адрес"
                    }
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {isCopiedRequisites ? (
                        <path d="M20 6L9 17l-5-5" />
                      ) : (
                        <>
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="payment-actions">
              <button
                className="confirm-button"
                onClick={handlePaymentConfirmation}
                disabled={isLoading}
              >
                {isLoading ? "Подтверждение..." : "Оплатил"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

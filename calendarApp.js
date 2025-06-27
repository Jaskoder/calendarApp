const { useState } = React;

const SimpleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [alert, setAlert] = useState({message : "", type : ""});
    const [searchedDate, setSearchedDate] = useState({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
    })
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const icons = {
        info : "\u24d8",
        warning : "\u26a0",
        error : "\u2716",
        success : "\u2714"
    }
    
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    const getLastDayOfMonth = (year, month) => {
        const daysInMonth = getDaysInMonth(year, month);
        return new Date(year, month, daysInMonth).getDay();
    }
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };
    
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfMonth = getLastDayOfMonth(year, month);
        
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="empty-day"></div>);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = (
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            );
            
            days.push(
                <div key={day} className={`day ${isToday ? 'today' : ''}`}> {day} </div>
            );
        }
        for (let i = 0; i < 6 - lastDayOfMonth; i++) {
            days.push(<div key={`empty${i}`} className="empty-day"></div>)
        }
        
        return days;
    };
    const showAlert = (message, type="info") => {
        setAlert({message, type});
        setTimeout(() => {
            setAlert({message : "", type : ""})
        }, 3000)
    }
    const handleInput = (e) => {
        const { name, value } = e.target;
        if (value < 0) {
            showAlert("Negative or nullish numbers are not allowed", "warning");
            return;
        }
        if (name === "month" && value.length > 2) {
            showAlert("Month length can't be more than two digits long", "warning");
            return;
        }
        if (name === "year" && value.length > 4) {
            showAlert("To ensure better use of app, Year number is limited to four digits ")
            return;
        }
        if (name === "year" && value < 1900 ) {
            showAlert('Minimal supported number of year is "1900"', "warning");
            return;
        if (name === "month" && value > 12) {
            showAlert("The month number can never exceed 12", "warning");
            return;
        }
        setSearchedDate(prev => (
        {
            ...prev,
            [name]: isNaN(parseInt(value)) ? "" : parseInt(value)
        }));
    }
    const goToDate = () => {
        const { year, month } = searchedDate;
        setCurrentDate(new Date(year, month - 1, 1));
    }
    return (
        <>
        {
            alert.message && (
                <div className={`alert-box ${alert.type}`}>
                    <span className="alert-icon">
                        {icons[alert.type]}
                    </span>
                    <span className="alert-message">
                        {alert.message}
                    </span>
                </div>
            )
        }
        <div className="searchbox">
            <input type="number" name="year" value={searchedDate["year"]} placeholder="Year" onInput={handleInput}></input>
            <input type="number" name="month" value={searchedDate["month"]} placeholder="Month" onInput={handleInput}></input>
            <button id="search-btn" onClick={() => goToDate()} disabled={!searchedDate.year || !searchedDate.month}> Search </button>
        </div>
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2> {months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={nextMonth}>&gt;</button>
                <button onClick={goToToday}>Today</button>
            </div>
            <div className="weekdays">
                {daysOfWeek.map(day => (
                    <div key={day} className="weekday">{day}</div> ))
                }
            </div>
            <div className="calendar-grid"> {renderCalendar()} </div>
        </div>
        </>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<SimpleCalendar/>);

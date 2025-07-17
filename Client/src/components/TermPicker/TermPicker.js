import React, { Component } from "react";
import '../TermPicker/termpicker.css';

const months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
];

const styles = {
    termInput: "termInput",
    active: "active",
    termInputControl: "termInputControl",
    selecting: "selecting",
    picker: "picker",
    pickerCaret: "pickerCaret",
    yearOneContext: "yearOneContext",
    yearTwoContext: "yearTwoContext",
    pickerControl: "pickerControl",
    isStartMonth: "isStartMonth",
    isEndMonth: "isEndMonth",
    pickerControlInner: "pickerControlInner",
    cellWithinRange: "cellWithinRange",
    selected: "selected"
};

const dateToLocalMidnightDateTime = (date) => new Date(
    new Date(date).setTime(
        new Date(date).getTime() +
        ((new Date(date).getTimezoneOffset() / 60) * 60 * 60 * 1000)
    )
);

const pad = (pad, str, padLeft) => {
    if (typeof str === "undefined") return pad;
    if (padLeft) return (pad + str).slice(-pad.length);
    return (str + pad).substring(0, pad.length);
};

class TermPicker extends Component {
    constructor(props) {
        super(props);
        const { defaultStartValue, defaultEndValue, dayOfMonth = 1 } = props;
        const currentDate = new Date();
        const startDate = defaultStartValue
            ? dateToLocalMidnightDateTime(defaultStartValue)
            : new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        const endDate = defaultEndValue
            ? dateToLocalMidnightDateTime(defaultEndValue)
            : new Date(currentDate.setMonth(currentDate.getMonth() + 12));

        this.state = {
            selectingStart: false,
            selectingEnd: false,
            yearContext: startDate.getFullYear(),
            startMonth: startDate.getMonth(),
            endMonth: endDate.getMonth(),
            startYear: startDate.getFullYear(),
            endYear: endDate.getFullYear(),
            startMonthCaretPosition: "66px",
            endMonthCaretPosition: "190px"
        };

        this.start = {
            _value: `${this.state.startYear}-${pad("00", this.state.startMonth + 1, true)}-${pad("00", dayOfMonth, true)}`
        };
        this.end = {
            _value: `${this.state.endYear}-${pad("00", this.state.endMonth + 1, true)}-${pad("00", dayOfMonth, true)}`
        };

        Object.defineProperty(this.start, "value", {
            get: () => this.start._value,
            set: (val) => {
                this.start._value = val;
                this.onChange("start");
            }
        });
        Object.defineProperty(this.end, "value", {
            get: () => this.end._value,
            set: (val) => {
                this.end._value = val;
                this.onChange("end");
            }
        });
    }

    render() {
        const {
            selectingStart, selectingEnd, yearContext,
            startMonth, endMonth, startYear, endYear,
            startMonthCaretPosition, endMonthCaretPosition
        } = this.state;
        const picking = selectingStart || selectingEnd;

        const pickerMarkup = picking && (
            <div className={styles.picker}>
                <div
                    style={{ left: selectingEnd ? endMonthCaretPosition : startMonthCaretPosition }}
                    className={styles.pickerCaret}
                ></div>
                {[[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]]].map((year, yearIndex) => (
                    <div key={yearIndex} className={yearIndex === 0 ? styles.yearOneContext : styles.yearTwoContext}>
                        <table>
                            <thead>
                                <tr>
                                    <th width="15" onClick={() => this.onSelectYear("decrement")}>{yearIndex === 0 && <svg viewBox="0 0 51.4 51.4"><path d="M31.4 45.8L15.3 29.7h36.1v-8H15.3L31.4 5.6 25.7 0 0 25.7l25.7 25.7" /></svg>}</th>
                                    <th width="70">{yearIndex === 0 ? yearContext : yearContext + 1}</th>
                                    <th width="15" onClick={() => this.onSelectYear("increment")}>{yearIndex === 1 && <svg viewBox="0 0 51.4 51.4"><path d="M20 5.6l16.1 16.1H0v8h36.1L20 45.8l5.7 5.6 25.7-25.7L25.7 0" /></svg>}</th>
                                </tr>
                            </thead>
                        </table>
                        <table>
                            <tbody>
                                {year.map((quarter, i) => (
                                    <tr key={i}>
                                        {quarter.map(month => {
                                            const currentYear = yearIndex === 0 ? yearContext : yearContext + 1;
                                            const classes = [styles.pickerControl];
                                            let tdClass = null;
                                            if (currentYear === startYear) {
                                                if (month === startMonth) classes.push(styles.selected, styles.isStartMonth);
                                                if (month > startMonth) tdClass = styles.cellWithinRange;
                                                if (currentYear === endYear && month >= endMonth) tdClass = null;
                                            }
                                            if (currentYear === endYear) {
                                                if (month === endMonth) classes.push(styles.selected, styles.isEndMonth);
                                                if (month < endMonth) tdClass = styles.cellWithinRange;
                                                if (currentYear === startYear && month <= startMonth) tdClass = null;
                                            }
                                            if (currentYear > startYear && currentYear < endYear) tdClass = styles.cellWithinRange;

                                            return (
                                                <td className={tdClass} key={month}>
                                                    <div
                                                        onClick={() => this.onSelectMonth(month, currentYear, "click")}
                                                        onMouseEnter={() => this.onSelectMonth(month, currentYear, "hover")}
                                                        className={classes.join(" ")}
                                                    >
                                                        <div className={styles.pickerControlInner}>{months[month]}</div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );

        return (
            <div
                className={[styles.termInput, (selectingStart || selectingEnd) ? styles.active : null].join(" ")}
                tabIndex="-1"
                onBlur={() => this.setState({ selectingStart: false, selectingEnd: false })}
            >
                <i className="fa fa-calendar"></i>&nbsp;
                <span
                    className={[styles.termInputControl, styles.isStartMonth, selectingStart ? styles.selecting : null].join(" ")}
                    onClick={() => this.setState({ yearContext: startYear, selectingStart: true, selectingEnd: false })}
                >
                    {months[startMonth]} {startYear}
                </span>
                &nbsp;&mdash;&nbsp;
                <span
                    className={[styles.termInputControl, styles.isEndMonth, selectingEnd ? styles.selecting : null].join(" ")}
                    onClick={() => this.setState({ yearContext: endYear === startYear ? endYear : endYear - 1, selectingStart: false, selectingEnd: true })}
                >
                    {months[endMonth]} {endYear}
                </span>
                {pickerMarkup}
            </div>
        );
    }

    onSelectMonth(month, year, type) {
        let { selectingStart, startMonth, startYear, endMonth, endYear, yearContext } = this.state;

        if (selectingStart) {
            startMonth = month;
            startYear = year;
            if (type === "click") {
                yearContext = year;
                endMonth = (startMonth + 11) % 12;
                endYear = endMonth === 11 ? startYear : startYear + 1;
            }
        } else {
            endMonth = month;
            endYear = year;
        }

        let nextState = { ...this.state, startMonth, endMonth, startYear, endYear, yearContext };

        if (type === "click") {
            nextState = this.fixDates(nextState);
            if (selectingStart) {
                nextState.selectingStart = false;
                nextState.selectingEnd = true;
            }
        }

        this.setState(nextState);

        if (type === "click") {
            this.set();
            if (!selectingStart) setTimeout(() => this.setState({ selectingStart: false, selectingEnd: false }), 200);
        }
    }

    onSelectYear(dir) {
        const { yearContext: old, selectingStart } = this.state;
        const yearContext = dir === "increment" ? old + 1 : old - 1;
        let { startYear, endYear } = this.state;
        if (selectingStart) startYear = yearContext;
        else endYear = yearContext;
        this.setState(this.fixDates({ ...this.state, yearContext, startYear, endYear }));
        this.set();
    }

    fixDates({ selectingStart, selectingEnd, yearContext, startMonth, startYear, endMonth, endYear }) {
        if (selectingStart) {
            if (startYear > endYear) endYear++;
            if (startYear === endYear && startMonth >= endMonth) {
                endMonth = (startMonth + 1) % 12;
                if (endMonth === 0) endYear++;
            }
        } else {
            if (endYear < startYear) startYear--;
            if (startYear === endYear && startMonth >= endMonth) {
                startMonth = (endMonth + 11) % 12;
                if (startMonth === 11) startYear--;
            }
        }
        return { selectingStart, selectingEnd, yearContext, startMonth, startYear, endMonth, endYear };
    }

    onChange(field) {
        const { onChange = () => { }, startName = "start", endName = "end" } = this.props;
        const { start, end } = this;
        if (field === "start") onChange({ target: { name: startName, value: start.value } });
        else onChange({ target: { name: endName, value: end.value } });
    }

    set(field = "all") {
        const { startYear, startMonth, endYear, endMonth } = this.state;
        const { dayOfMonth = 1 } = this.props;
        if (field === "start" || field === "all") this.start.value = `${startYear}-${pad("00", startMonth + 1, true)}-${pad("00", dayOfMonth, true)}`;
        if (field === "end" || field === "all") this.end.value = `${endYear}-${pad("00", endMonth + 1, true)}-${pad("00", dayOfMonth, true)}`;
    }
}

export default TermPicker;

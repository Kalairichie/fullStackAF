import React, { useState, useEffect, useCallback } from 'react'
import Header from '../../../components/Header/Header';
import { FaEdit } from "react-icons/fa";
import { baseUrl } from '../../../Urls';
import { useNavigate, useLocation } from 'react-router-dom';
import './salesform.css';

function SalesForm() {
    const [formData, setFormData] = useState({
        soDate: '',
        estDate: '',
        date: '',
        sNo: '',
        companyName: '',
        productName: '',
        addressLine1: '',
        addressLine2: '',
        contactPerson: '',
        phone: '',
        email: '',
        quotationNo: '',
        amount: '',
        scope: '',
        source: '',
        note: '',
        estNote: '',
        SONote: '',
        followUp: '',
        purchaseOrder: '',
        status: '',
        poStatus: '',
        attachments: [],
        estAttachments: [],
    });

    const [errors, setErrors] = useState({});
    const [salesList, setSalesList] = useState([]);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fromEstimation, setFromEstimation] = useState(false);
    const [fromSalesOrder, setFromSalesOrder] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchSales = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/sales`);
            const data = await response.json();
            setSalesList(data);
            if (!location.state?.sale) {
                const latestSNo = data.length > 0 ? Math.max(...data.map(s => s.sNo || 0)) + 1 : 5001;
                setFormData(prev => ({ ...prev, sNo: latestSNo }));
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    }, [location.state?.sale]);

    useEffect(() => {
        fetchSales();

        const savedToast = localStorage.getItem('persistentToast');
        if (savedToast) {
            setToastMsg(savedToast);
            setShowToast(true);
        }

        if (location.state?.sale) {
            const saleToEdit = location.state.sale;

            const isFromEstimation = location.state?.from === 'estimation';
            const isFromSalesOrder = location.state?.from === 'sales-order';
            setFromEstimation(isFromEstimation);
            setFromSalesOrder(isFromSalesOrder);

            setFormData({
                ...saleToEdit,
                soDate: isFromSalesOrder
                    ? saleToEdit.soDate || new Date().toISOString().split('T')[0]
                    : saleToEdit.soDate ?? '',
                estDate: isFromEstimation
                    ? saleToEdit.estDate || new Date().toISOString().split('T')[0]
                    : saleToEdit.estDate ?? '',
                date: saleToEdit.date ?? '',
                sNo: saleToEdit.sNo ?? '',
                companyName: saleToEdit.companyName ?? '',
                productName: saleToEdit.productName ?? '',
                addressLine1: saleToEdit.addressLine1 ?? '',
                addressLine2: saleToEdit.addressLine2 ?? '',
                contactPerson: saleToEdit.contactPerson ?? '',
                phone: saleToEdit.phone ?? '',
                email: saleToEdit.email ?? '',
                quotationNo: saleToEdit.quotationNo ?? '',
                amount: saleToEdit.amount ?? '',
                scope: saleToEdit.scope ?? '',
                source: saleToEdit.source ?? '',
                note: saleToEdit.note ?? '',
                estNote: saleToEdit.estNote ?? '',
                SONote: saleToEdit.SONote ?? '',
                followUp: saleToEdit.followUp ?? '',
                purchaseOrder: saleToEdit.purchaseOrder ?? '',
                status: saleToEdit.status ?? '',
                poStatus: saleToEdit.poStatus || 'pending',
                attachments: saleToEdit.attachments || [],
                estAttachments: saleToEdit.estAttachments || [],
                _id: saleToEdit._id ?? ''
            });

            setIsEditing(true);
        } else {
            setFromEstimation(false);
            setFromSalesOrder(false);
        }

        window.history.replaceState({}, document.title);
    }, [location.state, fetchSales]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let message = '';

        switch (name) {
            case 'companyName':
            case 'productName':
            case 'contactPerson':
                if (!/^[A-Za-z0-9\s.,()-]*$/.test(value)) {
                    message = 'Only letters allowed.';
                }
                break;

            case 'phone':
                const cleaned = value.replace(/\s+/g, '');
                if (!/^(\+?\d{10,15})$/.test(cleaned)) {
                    message = 'Phone number must contain 10–15 digits and may start with +';
                }
                break;

            case 'email':
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|in)$/.test(value)) {
                    message = 'Please enter a valid email (e.g. .com, .co, or .in)';
                }
                break;

            case 'amount':
                if (value === '') {
                    message = '';
                } else if (!/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(value) && !/^\d+(\.\d{1,2})?$/.test(value)) {
                    message = 'Only positive numbers allowed (e.g. 10,000 or 10000.50)';
                }
                break;

            case 'date':
                const datePattern = /^\d{4}-\d{2}-\d{2}$/;
                if (!datePattern.test(value)) {
                    message = 'Please enter a valid date in YYYY-MM-DD format.';
                } else {
                    const year = parseInt(value.split('-')[0], 10);
                    if (year < 1900 || year > 2099) {
                        message = 'Year must be between 1900 and 2099.';
                    }
                }
                break;

            default:
                message = '';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: message
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.date.trim()) newErrors.date = 'Date is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const formPayload = {
                ...formData,
                amount: Number(String(formData.amount || '0').replace(/,/g, '')),
            };

            let response;
            let savedSale;

            if (isEditing && formData._id) {
                // Update sale
                response = await fetch(`${baseUrl}/api/sales/${formData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formPayload)
                });
            } else {
                // Create new sale
                response = await fetch(`${baseUrl}/api/sales`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formPayload)
                });
            }

            const rawText = await response.text();
            console.log("Raw Response:", rawText);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            savedSale = JSON.parse(rawText);
            if (savedSale?.offline) {
                alert("Sale saved offline and will sync once you're online.");
                return;
            }

            if (isEditing && formData._id) {
                setSalesList(prev =>
                    prev.map(sale => (sale._id === savedSale._id ? savedSale : sale))
                );
                if (fromEstimation) {
                    navigate('/estimation');
                    return;
                }
                if (fromSalesOrder) {
                    navigate('/sales-order');
                    return;
                }
            } else {
                setSalesList(prev => [...prev, savedSale]);
            }

            setToastMsg(savedSale.note || 'Saved successfully');
            setShowToast(true);
            localStorage.setItem('persistentToast', savedSale.note || 'Saved successfully');

            await fetchSales();

            const updatedList = await fetch(`${baseUrl}/api/sales`);
            const updatedSales = await updatedList.json();
            const latestSNo = Math.max(...updatedSales.map(s => s.sNo || 0)) + 1;

            setFormData(prev => ({
                ...prev,
                _id: '',
                sNo: latestSNo,
                soDate: fromSalesOrder ? new Date().toISOString().split('T')[0] : '',
                estDate: fromEstimation ? new Date().toISOString().split('T')[0] : '',
                date: '',
                companyName: '',
                productName: '',
                addressLine1: '',
                addressLine2: '',
                contactPerson: '',
                phone: '',
                email: '',
                quotationNo: '',
                amount: '',
                scope: '',
                source: '',
                note: '',
                estNote: '',
                SONote: '',
                followUp: '',
                status: '',
                attachments: [],
                purchaseOrder: '',
            }));

            document.getElementById('attachments').value = '';
            document.getElementById('estAttachments').value = '';
            setErrors({});
            setIsEditing(false);

        } catch (error) {
            console.error('Error saving sale:', error);
        }
    };

    const handleCloseToast = () => {
        setShowToast(false);
        localStorage.removeItem('persistentToast');
    };

    const handleReset = () => {
        const nextSNo = formData.sNo;

        setFormData({
            sNo: nextSNo,
            soDate: fromSalesOrder ? new Date().toISOString().split('T')[0] : '',
            estDate: fromEstimation ? new Date().toISOString().split('T')[0] : '',
            date: '',
            companyName: '',
            productName: '',
            addressLine1: '',
            addressLine2: '',
            contactPerson: '',
            phone: '',
            email: '',
            quotationNo: '',
            amount: '',
            scope: '',
            source: '',
            note: '',
            estNote: '',
            SONote: '',
            followUp: '',
            status: '',
            poStatus: '',
            attachments: [],
            estAttachments: []
        });

        setErrors({});
        setToastMsg('');
        setShowToast(false);

        const input = document.getElementById('attachments');
        if (input) input.value = '';
    };

    const handleEdit = (sale, origin) => {
        const isFromEstimation = origin === 'estimation';
        const isFromSalesOrder = origin === 'sales-order';

        const updatedForm = {
            ...sale,
            soDate: isFromSalesOrder
                ? sale.soDate || new Date().toISOString().split('T')[0]
                : sale.soDate ?? '',
            estDate: isFromEstimation
                ? sale.estDate || new Date().toISOString().split('T')[0]
                : sale.estDate ?? '',
            attachments: [],
            estAttachments: sale.estAttachments || [],
        };

        setFormData(updatedForm);
        setIsEditing(true);
        setFromEstimation(isFromEstimation);
        setFromSalesOrder(isFromSalesOrder);

        navigate('/sales', { state: { sale, from: origin } });
    };

    return (
        <>
            <Header />
            <div className='container sales-form-container mb-3' style={{ marginTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow p-4 sales-form-container">
                            <h4>{isEditing ? 'Edit Enquiry' : 'New Enquiry'}</h4>
                            <hr />
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="form-group mb-3">
                                    <label htmlFor="date">Enq Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date"
                                        name="date"
                                        // value={formData.date ?? ''}
                                        value={formData.date || new Date().toISOString().split('T')[0]}
                                        onChange={handleChange}
                                        min="1900-01-01"
                                        max="2025-12-31"
                                        disabled={fromEstimation || fromSalesOrder}
                                    />
                                    {errors.date && <small className="text-danger">{errors.date}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="sNo">S.No</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="sNo"
                                        name="sNo"
                                        value={formData.sNo ?? ''}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                    {errors.sNo && <small className="text-danger">{errors.sNo}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="companyName">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="productName">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productName"
                                        name="productName"
                                        value={formData.productName ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.productName && <small className="text-danger">{errors.companyName}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="addressLine1">Address Line 1</label>
                                    <textarea
                                        className="form-control"
                                        id="addressLine1"
                                        name="addressLine1"
                                        rows="3"
                                        value={formData.addressLine1 ?? ''}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.addressLine1 && <small className="text-danger">{errors.addressLine1}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="addressLine2">Address Line 2</label>
                                    <textarea
                                        className="form-control"
                                        id="addressLine2"
                                        name="addressLine2"
                                        rows="3"
                                        value={formData.addressLine2 ?? ''}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.addressLine2 && <small className="text-danger">{errors.addressLine2}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="contactPerson">Contact Person</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="contactPerson"
                                        name="contactPerson"
                                        value={formData.contactPerson ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.contactPerson && <small className="text-danger">{errors.contactPerson}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="phone">Mobile No</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="attachments">Paste Lead Drive Link</label>
                                    <textarea
                                        className="form-control"
                                        id="attachments"
                                        name="attachments"
                                        placeholder="Paste one or more links"
                                        rows="3"
                                        value={formData.attachments.join('\n')}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const links = input
                                                .replace(/(https?:\/\/[^ ]+?\.pdf)(?=https?:\/\/)/g, '$1\n')
                                                .split(/\s+/)
                                                .map(link => link.trim())
                                                .filter(Boolean);

                                            setFormData(prev => ({
                                                ...prev,
                                                attachments: links
                                            }));
                                        }}
                                        disabled={fromEstimation || fromSalesOrder}
                                    />
                                    {errors.attachments && <small className="text-danger">{errors.attachments}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="scope">Scope</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="scope"
                                        name="scope"
                                        value={formData.scope ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.scope && <small className="text-danger">{errors.scope}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="source">Source</label>
                                    <select
                                        className="form-control"
                                        id="source"
                                        name="source"
                                        value={formData.source ?? ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="IndiaMart">IndiaMart</option>
                                        <option value="Website">Website</option>
                                        <option value="Mail">Mail</option>
                                        <option value="Thomas Philip">Thomas Philip</option>
                                        <option value="Vinayan Nambiar">Vinayan Nambiar</option>
                                        <option value="Vishnu">Vishnu</option>
                                        <option value="Shobana Devi">Shobana Devi</option>
                                        <option value="Joe">Joe</option>
                                        <option value="Karthikeyan">Karthikeyan</option>
                                    </select>
                                    {errors.source && <small className="text-danger">{errors.source}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="followUp">Follow-Up</label>
                                    <select
                                        className="form-control"
                                        id="followUp"
                                        name="followUp"
                                        value={formData.followUp ?? ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Thomas Philip">Thomas Philip</option>
                                        <option value="Vinayan Nambiar">Vinayan Nambiar</option>
                                        <option value="Vinayan Nambiar">Sukesh Krishnan</option>
                                        <option value="Vishnu">Vishnu</option>
                                        <option value="Shobana Devi">Shobana Devi</option>
                                        <option value="Joe">Joe</option>
                                        <option value="Karthikeyan">Karthikeyan</option>
                                    </select>
                                    {errors.followUp && <small className="text-danger">{errors.followUp}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="note">Lead note</label>
                                    <textarea
                                        className="form-control"
                                        id="note"
                                        name="note"
                                        rows="2"
                                        value={formData.note ?? ''}
                                        onChange={handleChange}
                                        disabled={fromEstimation || fromSalesOrder}
                                    ></textarea>
                                    {errors.note && <small className="text-danger">{errors.note}</small>}
                                </div>

                                {/* Estimation Fields */}


                                {(fromEstimation || fromSalesOrder) && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="estDate">EST Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="estDate"
                                            id="estDate"
                                            value={formData.estDate ?? ''}
                                            onChange={handleChange}
                                            disabled={!fromEstimation}
                                        />
                                    </div>
                                )}

                                <div className="form-group mb-3">
                                    <label htmlFor="quotationNo">Quotation No</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quotationNo"
                                        name="quotationNo"
                                        value={formData.quotationNo ?? ''}
                                        onChange={handleChange}
                                        disabled={!fromEstimation}
                                    />
                                    {errors.quotationNo && <small className="text-danger">{errors.quotationNo}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="amount">Amount</label >
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount ?? ''}
                                        onChange={handleChange}
                                        min="1"
                                        disabled={!fromEstimation}
                                    />
                                    {errors.amount && <small className="text-danger">{errors.amount}</small>}
                                </div>


                                <div className="form-group mb-3">
                                    <label htmlFor="estAttachments">Paste Estimation Drive Link</label>
                                    <textarea
                                        className="form-control"
                                        id="estAttachments"
                                        name="estAttachments"
                                        placeholder="Paste one or more Google Drive links, separated by new lines"
                                        rows="3"
                                        value={formData.estAttachments.join('\n')}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const links = input
                                                .replace(/(https?:\/\/[^ ]+?\.pdf)(?=https?:\/\/)/g, '$1\n')
                                                .split(/\s+/)
                                                .map(link => link.trim())
                                                .filter(Boolean);

                                            setFormData(prev => ({
                                                ...prev,
                                                estAttachments: links
                                            }));
                                        }}
                                        disabled={!fromEstimation}
                                    />
                                    {errors.estAttachments && <small className="text-danger">{errors.estAttachments}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="estNote">Estimation note</label>
                                    <textarea
                                        className="form-control"
                                        id="estNote"
                                        name="estNote"
                                        rows="2"
                                        value={formData.estNote ?? ''}
                                        onChange={handleChange}
                                        disabled={!fromEstimation}
                                    ></textarea>
                                    {errors.estNote && <small className="text-danger">{errors.note}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="poStatus">Proposal Status</label>
                                    <input
                                        className="form-control"
                                        id="poStatus"
                                        name="poStatus"
                                        value={formData.poStatus ?? ''}
                                        onChange={handleChange}
                                        disabled={!fromEstimation}
                                    />
                                    {errors.poStatus && <small className="text-danger">{errors.poStatus}</small>}
                                </div>

                                {/* Sales Order Fields */}

                                {fromSalesOrder && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="soDate">Follow-Up Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="soDate"
                                            id="soDate"
                                            value={formData.soDate ?? ''}
                                            onChange={handleChange}
                                            disabled={!fromSalesOrder}
                                        />
                                    </div>
                                )}

                                <div className="form-group mb-3">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        className="form-control"
                                        id="status"
                                        name="status"
                                        value={formData.status ?? ''}
                                        onChange={handleChange}
                                        disabled={!fromSalesOrder}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="initial">Initial</option>
                                        <option value="won">Won</option>
                                        <option value="lose">Lose</option>
                                        <option value="pipeline">Pipeline</option>
                                    </select>
                                    {errors.status && <small className="text-danger">{errors.status}</small>}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="SONote">Sales Order note</label>
                                    <textarea
                                        className="form-control"
                                        id="SONote"
                                        name="SONote"
                                        rows="2"
                                        value={formData.SONote ?? ''}
                                        onChange={handleChange}
                                        disabled={!fromSalesOrder}
                                    ></textarea>
                                    {errors.SONote && <small className="text-danger">{errors.SONote}</small>}
                                </div>

                                {/* Purchase Order Fileds */}

                                <div className="form-group mb-3">
                                    <label htmlFor="purchaseOrder">Purchase Order</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="purchaseOrder"
                                        name="purchaseOrder"
                                        value={formData.purchaseOrder ?? ''}
                                        onChange={handleChange}
                                    />
                                    {errors.purchaseOrder && <small className="text-danger">{errors.purchaseOrder}</small>}
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="btn btn-primary m-2" onClick={handleReset}>
                                    Reset
                                </button>
                            </form>
                            {showToast && (
                                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                                    <div className="toast show text-bg-success" role="alert">
                                        <div className="d-flex">
                                            <div className="toast-body">
                                                <strong>note:</strong> {toastMsg}
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white me-2 m-auto"
                                                onClick={handleCloseToast}
                                            ></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-7">
                        <div className="table-container" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                            <table className="table table-bordered table-hover" style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                                <thead>
                                    <tr>
                                        <th>Edit</th>
                                        <th>Enq Date</th>
                                        <th>SNo</th>
                                        <th>Company Name</th>
                                        <th>Product Name</th>
                                        <th>Address Line1</th>
                                        <th>Address Line2</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Lead Attachments</th>
                                        <th>Scope</th>
                                        <th>Source</th>
                                        <th>Follow Up</th>
                                        <th>Lead Note</th>

                                        <th>Quotation No</th>
                                        <th>Amount</th>
                                        <th>EST Attachments</th>
                                        <th>Estimation Note</th>
                                        <th>Proposal Status</th>

                                        <th>Status</th>
                                        <th>Sales Order Note</th>
                                        <th>Purchase Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesList.map((sale) => (
                                        <tr key={sale._id}>
                                            <td><FaEdit
                                                style={{ marginLeft: "5px", color: "gray", cursor: "pointer" }}
                                                onClick={() => handleEdit(sale)}
                                            /></td>
                                            <td>{sale.date}</td>
                                            <td>{sale.sNo}</td>
                                            <td>{sale.companyName}</td>
                                            <td>{sale.productName}</td>
                                            <td>{sale.addressLine1}</td>
                                            <td>{sale.addressLine2}</td>
                                            <td>{sale.contactPerson}</td>
                                            <td>{sale.phone}</td>
                                            <td>{sale.email}</td>
                                            <td>
                                                {sale.attachments?.map((link, index) => (
                                                    <div key={index}>
                                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                                            View File {index + 1}
                                                        </a>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{sale.scope}</td>
                                            <td>{sale.source}</td>
                                            <td>{sale.followUp}</td>
                                            <td>{sale.note}</td>

                                            <td>{sale.quotationNo}</td>
                                            <td>{sale.amount}</td>
                                            <td>
                                                {sale.estAttachments?.map((link, index) => (
                                                    <div key={index}>
                                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                                            View File {index + 1}
                                                        </a>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{sale.estNote}</td>
                                            <td>{sale.poStatus}</td>

                                            <td>{sale.status}</td>
                                            <td>{sale.SONote}</td>
                                            <td>{sale.purchaseOrder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default SalesForm
import React, { useEffect, useState } from 'react';
import '../management.css';
import { baseUrl } from '../../../Urls';
import TermPicker from '../../../components/TermPicker/TermPicker';

function ManagementTable() {
  const [salesList, setSalesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    statuses: new Set(),
    purchaseOrders: new Set()
  });

  const fetchSales = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sales`);
      const data = await res.json();
      setSalesList(data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sales`);
        const data = await res.json();
        setSalesList(data);
        setFilteredList(data);
      } catch (err) {
        console.error('Error fetching sales:', err);
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    let filtered = salesList;

    // Filter by Enq date
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(sale => {
        const enqDate = new Date(sale.date);
        return enqDate >= start && enqDate <= end;
      });
    }

    // Filter by status
    if (filters.statuses.size > 0) {
      filtered = filtered.filter(sale => {
        const normalizedStatus = (sale.status || '').toLowerCase();
        return Array.from(filters.statuses).some(s => s.toLowerCase() === normalizedStatus);
      });
    }
    setFilteredList(filtered);

    // Filter by purchaseOrder field
    if (filters.purchaseOrders.size > 0) {
      filtered = filtered.filter(sale => {
        const po = (sale.purchaseOrder || '').trim().toLowerCase();
        const isProcessed = po.includes('processed');
        return (
          (filters.purchaseOrders.has('processed') && isProcessed) ||
          (filters.purchaseOrders.has('pending') && !isProcessed)
        );
      });
    }
    setFilteredList(filtered);
  }, [filters, salesList]);


  const handleDateFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name === 'start' ? 'startDate' : 'endDate']: value }));
  };

  const handlePoStatus = async (id, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/sales/po-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poStatus: status }),
      });

      if (res.ok) {
        fetchSales();
      } else {
        console.error('Status update failed');
      }
    } catch (err) {
      console.error('Error updating PO status:', err);
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className="container estimation-container" style={{ marginTop: "100px" }}>
          <h2 className='ceo-heading' style={{ color: "white", fontFamily: "italic" }}>Management Page</h2>

          <div className='row'>
            <div className='col-sm-5 col-lg-3'>
              <div>
                <h6 className='status-title'>Status</h6>
                {['won', 'lose', 'pipeline'].map(status => (
                  <div className="form-check" style={{ color: "white" }} key={status}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="statusFilter"
                      id={`status-${status}`}
                      checked={filters.statuses.has(status)}
                      onChange={(e) => {
                        const updated = new Set();
                        if (e.target.checked) updated.add(status);
                        setFilters(prev => ({ ...prev, statuses: updated }));
                      }}
                    />
                    <label className="form-check-label" htmlFor={`status-${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h6 className='po-title mt-2'>Purchase Order</h6>
                {['processed', 'pending'].map(po => (
                  <div className="form-check" style={{ color: "white" }} key={po}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`po-${po}`}
                      checked={filters.purchaseOrders.has(po)}
                      onChange={(e) => {
                        let updated;
                        if (e.target.checked) {
                          updated = new Set([po]);
                        } else {
                          updated = new Set();
                        }
                        setFilters(prev => ({ ...prev, purchaseOrders: updated }));
                      }}
                    />
                    <label className="form-check-label" htmlFor={`po-${po}`}>
                      {po.charAt(0).toUpperCase() + po.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-sm mb-2 mt-2"
                onClick={() => {
                  setFilters({
                    startDate: '',
                    endDate: '',
                    statuses: new Set(),
                    purchaseOrders: new Set()
                  });
                }}
                style={{ backgroundColor: "rgba(10, 25, 47, 0.9)", color: "white" }}
              >
                Reset Filters
              </button>
              <TermPicker
                startName="start"
                endName="end"
                onChange={handleDateFilter}
              />
            </div>

            <div className="col-sm-7 col-lg-9 mt-3" style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-hover" style={{ fontSize: "14px", whiteSpace: "nowrap", minWidth: "1200px" }}>
                <thead>
                  <tr>
                    <th>Enq Date</th>
                    <th>EST Date</th>
                    <th>Follow-up Date</th>
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
                    <th>Quotation No</th>
                    <th>Amount</th>
                    <th>EST Attachments</th>
                    <th>Proposal Status</th>
                    <th>Management Action</th>
                    <th>Status</th>
                    <th>Lead note</th>
                    <th>Estimation Note</th>
                    <th>Sales Order Note</th>
                    <th>Purchase Order</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {salesList.filter(sale => sale.estDate).map((sale) => { */}
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan="25" className="text-left text-dark">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((sale) => (
                      // return (
                      <tr key={sale._id}>
                        <td>{sale.date}</td>
                        <td>{sale.estDate || '-'}</td>
                        <td>{sale.soDate || '-'}</td>
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
                        <td>
                          {sale.poStatus ? (
                            <span className={`badge ${sale.poStatus === 'approved' ? 'bg-success' : sale.poStatus === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {sale.poStatus}
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">pending</span>
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handlePoStatus(sale._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handlePoStatus(sale._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </td>


                        <td>{sale.status}</td>
                        <td>{sale.note}</td>
                        <td>{sale.estNote}</td>
                        <td>{sale.SONote}</td>
                        <td>
                          {sale.purchaseOrder && sale.purchaseOrder.toLowerCase().includes('processed') ? (
                            <span>Processed</span>
                          ) : (
                            <span className="text-muted">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

export default ManagementTable
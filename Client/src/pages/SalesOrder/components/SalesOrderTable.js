import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { baseUrl } from "../../../Urls";
import { FaEdit } from "react-icons/fa";

function SalesOrderTable() {
  const [salesList, setSalesList] = useState([]);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/sales`);
      const data = await res.json();
      setSalesList(data);
    } catch (err) {
      console.log("Error fetching sales:", err);
    }
  };
  useEffect(() => {
    fetchSales();
  }, []);
  const handleEdit = (sale) => {
    navigate("/sales", { state: { sale, from: "sales-order" } });
  };
  return (
    <>
      <div className="container">
        <div
          className="container estimation-container"
          style={{ marginTop: "100px" }}>
          <h2
            className="est-heading"
            style={{ color: "white", fontFamily: "italic" }}>
            Sales Order Page
          </h2>
          <div className="table-responsive mt-3">
            <table
              className="table table-bordered table-hover"
              style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <th>Edit</th>
                  <th>Follow-up Date</th>
                  <th>EST Date</th>
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
                    <td>
                      <FaEdit
                        style={{
                          marginLeft: "5px",
                          color: "gray",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEdit(sale)}
                      />
                    </td>
                    <td>{sale.soDate || "-"}</td>
                    <td>{sale.estDate || "-"}</td>
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
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer">
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
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer">
                            View File {index + 1}
                          </a>
                        </div>
                      ))}
                    </td>
                    <td>{sale.estNote}</td>
                    <td>{sale.poStatus}</td>

                    <td>{sale.status}</td>
                    <td>{sale.SONote}</td>
                    <td>
                      {sale.purchaseOrder &&
                      sale.purchaseOrder.toLowerCase().includes("processed") ? (
                        <span>Processed</span>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesOrderTable;

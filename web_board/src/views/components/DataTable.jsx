import React from "react";

export default function DataTable({ columns, data, title, actionButton, count }) {

    const [currentPage, setCurrentPage] = React.useState(1);
    const rowsPerPage = 10;

    // Slice ข้อมูลตามหน้า
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data?.slice(indexOfFirstRow, indexOfLastRow);

    // console.log('All Data:', data);

    const totalPages = Math.ceil(count / rowsPerPage);
    return (
        <div className="datatable-card">
            <h3>{title ? title : null}</h3>
            <div className='flex mb-15'>
                {actionButton ? actionButton : null}
            </div>
            <table className="datatable">
                <thead>
                    <tr>
                        {columns?.map((col, i) => (
                            <th key={i}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData?.map((row, index) => (
                        <tr key={index}>
                            {columns?.map((col) => (
                                <td key={col.accessor} className={col.accessor}>
                                    {col.cell ? col.cell(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination can be added here if needed */}
            <div className="pagination">
                <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                >
                ◀ Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                >
                    {i + 1}
                </button>
                ))}

                <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                >
                Next ▶
                </button>
            </div>
        </div>
    );
}
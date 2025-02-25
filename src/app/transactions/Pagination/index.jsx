export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div>
            <button onClick={() => onPageChange('prev')} disabled={currentPage === 1}>
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <span key={i} style={{ margin: '0 4px' }}>
                    {i + 1}
                </span>
            ))}
            <button onClick={() => onPageChange('next')} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    )
}

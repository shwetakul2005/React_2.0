import './InsightCard.css';

const InsightCard = ({ icon, title, value, detail, accent = 'blue' }) => {
    return (
        <div className={`insight-card accent-${accent}`}>
            <div className="insight-card-icon">{icon}</div>
            <div className="insight-card-body">
                <p className="insight-card-title">{title}</p>
                <h3 className="insight-card-value">{value}</h3>
                <p className="insight-card-detail">{detail}</p>
            </div>
        </div>
    );
};

export default InsightCard;

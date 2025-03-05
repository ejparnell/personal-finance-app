import { PieChart } from '@mui/x-charts/PieChart'

import currencyFormatter from '@/utils/currencyFormatter'
import styles from './DonutChart.module.css'

export default function DonutChart({ data, height, total, limit, innerRadius = 0 }) {
    function formatBudgets(budgets) {
        return budgets.map(budget => ({
            value: Number(budget.maximum),
            color: budget.theme.toLowerCase()
        }))
    }

    const formattedData = formatBudgets(data)

    return (
        <div className={styles.chart__container}>
            {data.length > 0 && <PieChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                series={[{
                    data: formattedData,
                    innerRadius: innerRadius,

                }]}
                height={height}
            />}
            <div className={styles.chart__details}>
                <p className={styles.chart__total}>{currencyFormatter(total)}</p>
                <p className={styles.chart__limit}>of {currencyFormatter(limit)} limit</p>
            </div>
        </div>
    )
}
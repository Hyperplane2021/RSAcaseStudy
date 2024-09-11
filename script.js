document.addEventListener("DOMContentLoaded", function() {
    const rows = document.querySelectorAll("#programTable tbody tr");
    const codeBlock = document.getElementById("codeBlock");
    const descriptionBlock = document.createElement("p"); // 创建一个 p 标签用于显示描述
    descriptionBlock.id = "descriptionBlock";
    codeBlock.after(descriptionBlock); // 将描述显示在代码块的下面

    let selectedRow = null; // 用于记录当前选中的行

    // 获取折线图的上下文
    const chartContext = document.getElementById('probChart').getContext('2d');
    let chart = null;

    // 初始化图表函数
    function createChart(probArray) {
        if (chart) {
            chart.destroy(); // 销毁之前的图表
        }
    
        chart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: probArray.map((_, index) => `prob ${index + 1}`),
                datasets: [{
                    label: 'log_probability based on description',
                    data: probArray,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,  // 禁用响应式布局
                maintainAspectRatio: false, // 不保持默认的宽高比
                scales: {
                    x: {
                        display: false // 隐藏 X 轴
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    rows.forEach(row => {
        row.addEventListener("click", function() {
            // 如果当前有选中的行，则取消其选中状态
            if (selectedRow) {
                selectedRow.classList.remove("selected");
            }
            
            // 标记当前行为选中状态
            selectedRow = row;
            row.classList.add("selected");

            const code = row.getAttribute("data-code");
            const description = row.getAttribute("data-description");
            const probString = row.getAttribute('prob'); // 获取 prob 属性

            // 在代码块中显示代码
            codeBlock.textContent = code;

            // 在描述块中显示描述
            descriptionBlock.textContent = description || "No description available";

            // 绘制折线图
            if (probString) {
                const probArray = probString.slice(1, -1).split(',').map(Number); // 解析 prob 属性
                createChart(probArray); // 调用绘制折线图函数
            }
        });
    });

    // 高亮每列中的最大值
    const table = document.getElementById("programTable");
    const rowsHighlight = table.querySelectorAll("tbody tr");

    // 遍历列，跳过第一列
    for (let col = 1; col <= 6; col++) {
        let maxVal = -Infinity;
        let maxCell = null;

        // 找到每一列的最大值
        rowsHighlight.forEach(row => {
            const cell = row.cells[col];
            const cellValue = parseFloat(cell.textContent);

            if (cellValue > maxVal) {
                maxVal = cellValue;
                maxCell = cell;
            }
        });

        // 为最大值单元格添加高亮类
        if (maxCell) {
            maxCell.classList.add("highlight");
        }
    }
});

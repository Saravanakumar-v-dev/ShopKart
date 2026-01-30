import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { FaDollarSign, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#8b5cf6"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      grid: {
        borderColor: "#3f3f46",
        strokeDashArray: 4,
      },
      markers: {
        size: 4,
        colors: ["#8b5cf6"],
        strokeColors: "#1f1f23",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#71717a",
          },
        },
        axisBorder: {
          color: "#3f3f46",
        },
        axisTicks: {
          color: "#3f3f46",
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#71717a",
          },
          formatter: (val) => `$${val?.toFixed(0)}`,
        },
      },
      legend: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const StatCard = ({ icon: Icon, label, value, color, isLoading }) => (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={20} />
      </div>
      <p className="text-dark-500 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">
        {isLoading ? <Loader size="small" /> : value}
      </p>
    </div>
  );

  return (
    <div className="ml-[5rem] lg:ml-[5rem] min-h-screen py-8 px-4">
      <AdminMenu />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Admin Dashboard</span>
          </h1>
          <p className="text-dark-500">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={FaDollarSign}
            label="Total Sales"
            value={`$${sales?.totalSales?.toFixed(2) || 0}`}
            color="from-green-500 to-emerald-600"
            isLoading={isLoading}
          />
          <StatCard
            icon={FaUsers}
            label="Customers"
            value={customers?.length || 0}
            color="from-blue-500 to-cyan-600"
            isLoading={loading}
          />
          <StatCard
            icon={FaShoppingCart}
            label="Total Orders"
            value={orders?.totalOrders || 0}
            color="from-purple-500 to-primary-600"
            isLoading={loadingTwo}
          />
          <StatCard
            icon={FaChartLine}
            label="Avg. Order Value"
            value={`$${orders?.totalOrders ? (sales?.totalSales / orders?.totalOrders).toFixed(2) : 0}`}
            color="from-orange-500 to-amber-600"
            isLoading={isLoading || loadingTwo}
          />
        </div>

        {/* Chart */}
        <div className="glass-card p-6 mb-10 animate-fade-in">
          <h2 className="text-xl font-semibold mb-6">Sales Trend</h2>
          <Chart
            options={state.options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>

        {/* Orders List */}
        <div className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

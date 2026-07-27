import { Empty, Table } from "antd";
import SearchBar from "./SearchBar";
import TableErrorState from "./TableErrorState";

const CustomTable = ({
  loading,
  columns,
  dataSource = [],
  globalSearch,
  onSearchChange,
  searchPlaceholder = "Search...",
  totalLabel = "Total Records",
  isDarkMode = false,
  rowSelection,
  rowKey,
  footer,
  pagination,
  rowClassName,
  scroll = { x: true },
  pageSizeOptions = ["10", "20", "50", "100", "500"],
  defaultPageSize = 10,
  locale = {},
  isError = false,
  error = null,
  components,
  headerExtra,
  childrenColumnName = "childrenRows",
  ...props
}) => {
  const data = isError ? [] : dataSource;
  const totalCount = data?.length || 0;

  return (
    <Table
      {...props}
      childrenColumnName={childrenColumnName}
      components={components}
      rowKey={rowKey}
      loading={loading}
      columns={columns}
      dataSource={data}
      scroll={scroll}
      bordered
      showSorterTooltip={false}
      rowClassName={
        rowClassName ||
        (() =>
          "hover:bg-[#1b122b]/30 !h-12 [&>td]:!py-1.5 [&>td]:!px-2 cursor-pointer")
      }
      rowSelection={rowSelection}
      pagination={
        pagination || {
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: pageSizeOptions,
          defaultPageSize: defaultPageSize,
        }
      }
      title={() => (
        <div className="flex items-center justify-between">
          <div
            className={`text-md mt-2 sm:mt-1 font-medium flex items-center gap-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
            {totalLabel}: {totalCount.toLocaleString()}
          </div>

          <SearchBar
            value={globalSearch}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
      footer={footer}
      locale={{
        ...locale,
        emptyText:
          isError && error?.message !== "No record found." ? (
            <TableErrorState isError={isError} message={error?.message} />
          ) : (
            locale?.emptyText || (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: "#9ca3af" }}>No data</span>}
              />
            )
          ),
      }}
    />
  );
};

export default CustomTable;

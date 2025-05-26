export default function Header() {
  return (
    <header className="w-full text-center py-6 md:py-8">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
        🎈 宝宝发育早知道
      </h1>
      <p className="mt-2 text-gray-600 text-sm md:text-base font-medium">
        数据基于WHO儿童生长标准
      </p>
    </header>
  );
}
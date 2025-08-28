import FastBreakGame from '@/components/FastBreakGame';

export default function FastBreakPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <FastBreakGame embedded={true} />
        </div>
      </div>
    </div>
  );
}

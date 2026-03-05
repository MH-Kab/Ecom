export default function AnnouncementBar({ message = '🔥 10% OFF this week on all brake parts — Use code BRAKE10 at checkout!' }) {
  return (
    <div className="announcement-bar text-white text-sm font-medium py-2 px-4 text-center">
      <span className="inline-flex items-center gap-2">
        {message}
      </span>
    </div>
  );
}

const CreatorCard = () => {
  return (
    <div className="flex p-2 flex-col justify-center items-center gap-8">
      <div className="w-[175px] h-[175px] rounded-full bg-white" />
      <div className="flex flex-col justify-center items-center gap-1">
        <p className="font-semibold text-[26px]">Name Surname</p>
        <p className="text-[20px] !text-neutral-400">Some text</p>
      </div>
    </div>
  );
};

export default CreatorCard;

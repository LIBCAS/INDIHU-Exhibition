import { Spinner } from "components/spinner/spinner";

export const ViewLoading = () => {
  return (
    <div className="w-full h-full grid place-items-center bg-background">
      <Spinner scale={2} />
    </div>
  );
};

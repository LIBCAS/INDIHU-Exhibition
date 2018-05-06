import { Spinner } from "components/loaders/spinner";

export const ViewLoading = () => {
  return (
    <div className="w-full h-full grid place-items-center bg-background">
      <Spinner scale={2} />
    </div>
  );
};

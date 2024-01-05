import useLocalStorageListener from "./use-local-storage-listener";

const useUser = () => {
  const token = useLocalStorageListener("token");
  const roleString = useLocalStorageListener("role");
  const userName = useLocalStorageListener("userName");

  if (token && roleString && userName) {
    const role: string[] = JSON.parse(roleString);

    return {
      token,
      role: role,
      userName,
    };
  }

  return null;
};

export default useUser;

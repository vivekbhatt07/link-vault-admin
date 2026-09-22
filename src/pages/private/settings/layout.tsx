import { Outlet } from 'react-router';

const SettingsLayout = () => {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
          Settings
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage your admin account and preferences.
        </p>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;

"use server";

export const updatePageStateAction = async (id: string, state: boolean): Promise<{
  ok: boolean;
  message: string;
}> => {
  console.log(id);
  console.log(state);
  return new Promise((resolve) => {
    resolve({ ok: true, message: 'ok' });
  });
};
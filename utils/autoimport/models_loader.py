import os
import importlib
import inspect
from pathlib import Path


def find_base_dir(start_path, target_dir):
    current_path = Path(start_path).resolve()
    while current_path != current_path.parent:
        if (current_path / target_dir).exists():
            return current_path / target_dir
        current_path = current_path.parent
    return None


def import_all_models():
    base_dir = find_base_dir(__file__, 'app')
    if not base_dir:
        raise FileNotFoundError("Не удалось найти папку 'app' в иерархии директорий")

    unique_class = {}

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file == 'models.py':
                module_path = Path(root) / file
                module_rel_path = module_path.relative_to(base_dir.parent)
                module_name = str(module_rel_path).replace(os.sep, '.').replace('.py', '')

                if module_name.startswith('app'):
                    module = importlib.import_module(module_name)
                    for name, obj in inspect.getmembers(module, inspect.isclass):
                        if obj.__module__.startswith('app'):
                            if name not in unique_class:
                                unique_class[name] = obj

    globals().update(unique_class)


if __name__ == '__main__':
    import_all_models()

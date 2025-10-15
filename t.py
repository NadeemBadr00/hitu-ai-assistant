import numpy as np
x_train = np.array([0., 1, 2, 3, 4, 5])
y_train = np.array([0,  0, 0, 1, 1, 1])
pos = y_train == 1
neg = y_train == 0
print(pos)
print(neg)